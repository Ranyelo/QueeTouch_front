const express = require('express');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;
const SECRET_KEY = process.env.SECRET_KEY || "queen-touch-secret-key-CHANGE_IN_PROD";

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bogotacup@gmail.com',
        pass: 'baoaasrhxovnywhb'
    }
});

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiter for Auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});

// --- Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Routes ---

// 1. Auth
app.post('/api/auth/register',
    authLimiter,
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('name').not().isEmpty().trim().escape()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, name, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        db.run(`INSERT INTO users (email, password, name, isVerified, verificationCode) VALUES (?, ?, ?, 0, ?)`,
            [email, hashedPassword, name, verificationCode],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ message: 'User already exists' });
                    }
                    return res.status(500).json({ error: err.message });
                }

                // Send Email
                const mailOptions = {
                    from: 'Queen Touch <bogotacup@gmail.com>',
                    to: email,
                    subject: 'Verifica tu cuenta - Queen Touch',
                    text: `Hola,

Hemos recibido una solicitud de registro en Queen Touch.

Para continuar, utiliza el siguiente código de seguridad:

${verificationCode}

Este código expirará en 10 minutos.

Si tú no has intentado ingresar, por favor ignora este mensaje.

Atentamente,
Equipo de Queen Touch`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) console.log("Email Error:", error);
                });

                res.json({ message: "Verification code sent", email, needsVerification: true });
            }
        );
    });

app.post('/api/auth/verify',
    authLimiter,
    [
        body('email').isEmail().normalizeEmail(),
        body('code').isLength({ min: 6, max: 6 })
    ],
    (req, res) => {
        const { email, code } = req.body;
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!user) return res.status(404).json({ message: 'User not found' });

            if (user.isVerified) return res.status(400).json({ message: "User already verified" });
            if (user.verificationCode !== code) return res.status(400).json({ message: "Invalid code" });

            db.run(`UPDATE users SET isVerified = 1, verificationCode = NULL WHERE id = ?`, [user.id], (err) => {
                if (err) return res.status(500).json({ error: err.message });

                const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '24h' });
                const { password: _, verificationCode: __, ...userWithoutPass } = user;
                userWithoutPass.isVerified = 1;

                res.json({ token, user: userWithoutPass });
            });
        });
    });

app.post('/api/auth/login',
    authLimiter,
    [
        body('email').isEmail().normalizeEmail(),
        body('password').exists()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Check Verification
            if (!user.isVerified) return res.status(403).json({ message: "Account not verified", needsVerification: true, email: user.email });

            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) return res.status(401).json({ token: null, message: 'Invalid Password' });

            const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '24h' });

            // Remove password from response
            const { password: _, verificationCode: __, ...userWithoutPass } = user;
            res.json({ token, user: userWithoutPass });
        });
    });

app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Generate 6 digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 3600000; // 1 hour

        db.run('UPDATE users SET resetToken = ?, resetExpires = ? WHERE id = ?', [code, expires, user.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Send Email
            if (global.transporter) {
                const mailOptions = {
                    from: '"Queen Touch Support" <niko@indieflow.ai>',
                    to: email,
                    subject: 'Recuperación de Contraseña - Queen Touch',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
                            <h2 style="color: #000;">Recuperar Contraseña</h2>
                            <p>Has solicitado restablecer tu contraseña. Usa el siguiente código:</p>
                            <h1 style="font-size: 32px; letter-spacing: 5px; background: #f0f0f0; padding: 10px; text-align: center;">${code}</h1>
                            <p>Este código expira en 1 hora.</p>
                            <p>Si no solicitaste esto, ignora este correo.</p>
                        </div>
                    `
                };
                global.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email:', error);
                        // Don't fail the request, just log it (or fail if strict)
                    } else {
                        console.log('Reset email sent:', info.response);
                    }
                });
            }

            res.json({ message: 'Código enviado a tu correo' });
        });
    });
});

app.post('/api/auth/reset-password', (req, res) => {
    const { email, code, newPassword } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (user.resetToken !== code) {
            return res.status(400).json({ message: 'Código inválido' });
        }

        if (parseInt(user.resetExpires) < Date.now()) {
            return res.status(400).json({ message: 'El código ha expirado' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 8);

        db.run('UPDATE users SET password = ?, resetToken = NULL, resetExpires = NULL WHERE id = ?', [hashedPassword, user.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Contraseña actualizada correctamente' });
        });
    });
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
    const { tier, role } = req.body;
    const userId = req.user.id;

    // Build query dynamically based on what's provided, for now just tier/role
    let updates = [];
    let params = [];

    if (tier) {
        updates.push("tier = ?");
        params.push(tier);
    }
    if (role) {
        updates.push("role = ?");
        params.push(role);
    }

    if (updates.length === 0) return res.status(400).json({ message: "No updates provided" });

    params.push(userId);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ error: err.message });

        // Return updated user
        db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
            if (!user) return res.status(404).json({ message: "User not found" });
            const { password: _, verificationCode: __, ...userWithoutPass } = user;
            res.json({ message: "Profile updated", user: userWithoutPass });
        });
    });
});


// 2. Products
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        // Parse JSON fields
        const products = rows.map(p => ({
            ...p,
            images: JSON.parse(p.images),
            colors: JSON.parse(p.colors)
        }));
        res.json({ data: products });
    });
});

app.post('/api/products', authenticateToken, (req, res) => {
    // Only admin - simplified check
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

    const { id, name, price, description, category, subcategory, images, colors, stock } = req.body;

    db.run(`INSERT INTO products (id, name, price, description, category, subcategory, images, colors, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, price, description, category, subcategory, JSON.stringify(images), JSON.stringify(colors), stock],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Product added", id: this.lastID });
        }
    );
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    db.run(`DELETE FROM products WHERE id = ?`, req.params.id, function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "deleted", changes: this.changes });
    });
});


// 3. Orders
app.post('/api/orders', authenticateToken, (req, res) => {
    const { id, userId, date, total, status, items } = req.body;
    db.run(`INSERT INTO orders (id, userId, date, total, status, items) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, userId, date, total, status || 'processing', JSON.stringify(items)],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Order created" });
        }
    );
});

app.get('/api/orders', authenticateToken, (req, res) => {
    // If admin, see all. If user, see own.
    let sql = "SELECT * FROM orders";
    let params = [];

    if (!req.user.isAdmin) {
        sql += " WHERE userId = ?";
        params.push(req.user.email);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        const orders = rows.map(o => ({
            ...o,
            items: JSON.parse(o.items)
        }));
        res.json({ data: orders });
    });
});

// 4. Distributor Applications
// 4. Distributor Applications
app.get('/api/applications', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    db.all("SELECT * FROM applications", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.post('/api/applications', authenticateToken, (req, res) => {
    const app = req.body;
    db.run(`INSERT INTO applications (id, userId, fullName, businessName, address, city, phone, experience, capital, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [app.id, app.userId, app.fullName, app.businessName, app.address, app.city, app.phone, app.experience, app.capital, 'pending', new Date().toISOString()],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Application submitted" });
        }
    );
});

app.put('/api/applications/:id', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    const { status } = req.body;

    db.run(`UPDATE applications SET status = ? WHERE id = ?`, [status, req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });

        // If approved, update user role
        if (status === 'approved') {
            db.get(`SELECT userId FROM applications WHERE id = ?`, [req.params.id], (err, row) => {
                if (row) {
                    db.run(`UPDATE users SET role = 'distributor' WHERE email = ?`, [row.userId]);
                }
            });
        }

        res.json({ message: "Updated" });
    });
});

// 5. Orders Management (Update/Delete)
app.put('/api/orders/:id', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    const { status, shippingMethod, estimatedArrival } = req.body;

    let sql = "UPDATE orders SET status = ?";
    let params = [status];

    if (shippingMethod) {
        sql += ", shippingMethod = ?";
        params.push(shippingMethod);
    }
    if (estimatedArrival) {
        sql += ", estimatedArrival = ?";
        params.push(estimatedArrival);
    }

    sql += " WHERE id = ?";
    params.push(req.params.id);

    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Order updated" });
    });
});

app.delete('/api/orders/:id', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    db.run("DELETE FROM orders WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Order deleted" });
    });
});

// 6. Tickets
app.get('/api/tickets', authenticateToken, (req, res) => {
    let sql = "SELECT * FROM tickets";
    let params = [];
    if (!req.user.isAdmin) {
        sql += " WHERE userId = ?";
        params.push(req.user.email);
    }
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.post('/api/tickets', authenticateToken, (req, res) => {
    const { id, userId, subject, message } = req.body;
    db.run(`INSERT INTO tickets (id, userId, subject, message, status, date) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, userId, subject, message, 'open', new Date().toISOString()],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Ticket created" });
        }
    );
});

app.put('/api/tickets/:id', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    const { response, status } = req.body;
    db.run(`UPDATE tickets SET response = ?, status = ? WHERE id = ?`, [response, status, req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Ticket updated" });
    });
});

// 7. Appointments
app.get('/api/appointments', authenticateToken, (req, res) => {
    let sql = "SELECT * FROM appointments";
    // If not admin, maybe filter? For now, simplistic approach
    // In real app, distributors see their appointments, users might see theirs?
    // Based on types, appointment has 'distributorId'.
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.post('/api/appointments', authenticateToken, (req, res) => {
    const { id, distributorId, date, time, topic } = req.body;
    db.run(`INSERT INTO appointments (id, distributorId, date, time, topic, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, distributorId, date, time, topic, 'scheduled'],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Appointment scheduled" });
        }
    );
});

app.put('/api/appointments/:id', authenticateToken, (req, res) => {
    const { status, date, time } = req.body;
    // Simple update
    db.run(`UPDATE appointments SET status = ?, date = ?, time = ? WHERE id = ?`,
        [status, date, time, req.params.id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Appointment updated" });
        }
    );
});

// 8. Stats
app.get('/api/admin/stats', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

    // Execute queries in parallel
    const queries = {
        totalRevenue: "SELECT SUM(total) as revenue FROM orders WHERE status != 'cancelled'",
        ordersCount: "SELECT COUNT(*) as count FROM orders",
        usersCount: "SELECT COUNT(*) as count FROM users WHERE role = 'user'",
        lowStock: "SELECT COUNT(*) as count FROM products WHERE stock < 5",
        // Sales chart (last 7 days - simple simulation for SQLite)
        // Ensure we group by date properly. SQLite dates are strings YYYY-MM-DD...
        salesTrend: `SELECT strftime('%Y-%m-%d', date) as day, SUM(total) as daily_revenue 
                     FROM orders 
                     WHERE status != 'cancelled' 
                     GROUP BY day 
                     ORDER BY day DESC 
                     LIMIT 7`,
        categoryDist: "SELECT category, COUNT(*) as count FROM products GROUP BY category"
    };

    const results = {};
    let pending = Object.keys(queries).length;

    if (pending === 0) return res.json(results);

    const checkDone = () => {
        console.log(`Query done. pernding: ${pending - 1}`);
        if (--pending === 0) {
            console.log('All stats queries done, sending response');
            res.json(results);
        }
    };

    console.log('Starting admin stats queries...');

    db.get(queries.totalRevenue, (err, row) => {
        if (err) console.error('Revenue error:', err);
        results.revenue = row ? row.revenue : 0;
        checkDone();
    });
    db.get(queries.ordersCount, (err, row) => {
        if (err) console.error('Orders error:', err);
        results.orders = row ? row.count : 0;
        checkDone();
    });
    db.get(queries.usersCount, (err, row) => {
        if (err) console.error('Users error:', err);
        results.users = row ? row.count : 0;
        checkDone();
    });
    db.get(queries.lowStock, (err, row) => {
        if (err) console.error('LowStock error:', err);
        results.lowStock = row ? row.count : 0;
        checkDone();
    });
    db.all(queries.salesTrend, (err, rows) => {
        if (err) console.error('SalesTrend error:', err);
        results.salesChart = rows ? rows.reverse() : [];
        checkDone();
    });
    db.all(queries.categoryDist, (err, rows) => {
        if (err) console.error('CategoryDist error:', err);
        results.categories = rows || [];
        checkDone();
    });
});

// 9. Comments & Social
app.get('/api/comments/:targetId', (req, res) => {
    const { targetId } = req.params;
    const userId = req.headers['x-user-id']; // Optional: to check likes if needed simpler

    db.all(`SELECT * FROM comments WHERE targetId = ? ORDER BY createdAt DESC`, [targetId], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });

        // If we want to check if current user liked them, we need more complex query or separate call.
        // For simplicity: fetch likes for this user and map.

        res.json({ data: rows });
    });
});

app.post('/api/comments', authenticateToken, (req, res) => {
    const { targetId, parentId, content } = req.body;
    const commentId = `cmt-${Date.now()}`;
    const createdAt = new Date().toISOString();

    // AI Content Moderation (Simulated)
    const validateWithAI = async (text) => {
        // In a real production app, this would call OpenAI, Gemini, or AWS Comprehend
        // Example: await openai.moderations.create({ input: text });

        const inappropriateKeywords = [
            // Standard
            'estúpido', 'idiota', 'odio', 'muere', 'spam', 'casino', 'mierda', 'puta', 'malparido', 'gonorrea', 'hijo de puta', 'tonto', 'bobo', 'falso', 'estafa',
            'cabron', 'cabrón', 'pendejo', 'verga', 'culo', 'concha', 'gilipollas', 'joder', 'imbecil', 'imbécil',
            // Variations/Abbreviations/Slang
            'pdjo', 'pndj', 'pndx', 'pndho',
            'cbrn', 'kbron', 'cbr0n',
            'stpd', 'tupido',
            'idt',
            'mlprd', 'mparido',
            'hdp', 'hp', 'hijuep', 'shdp',
            'vrg', 'vga', 'vrg4',
            'mrd', 'mda', 'mrda',
            'ctm', 'chngtm',
            'ql', 'qlo', 'cl',
            'cdtm', 'conchtm',
            'gnrr', 'gnr',
            'glplls', 'gili',
            'nmms',
            'pt', 'p_t_a',
            'm4ldit0', 'maldito', 'basura', 'asqueroso', 'kbrn'
        ];
        const lowerText = text.toLowerCase();

        return new Promise((resolve) => {
            // Simulate API latency
            setTimeout(() => {
                const hasInappropriateContent = inappropriateKeywords.some(word => lowerText.includes(word));
                resolve(!hasInappropriateContent);
            }, 500);
        });
    };

    // Fetch latest user data to ensure we have the name
    db.get(`SELECT name FROM users WHERE email = ?`, [req.user.email], async (err, row) => {
        if (err) return res.status(400).json({ error: err.message });

        // AI Check
        const isSafe = await validateWithAI(content);
        if (!isSafe) {
            return res.status(400).json({ error: "Tu comentario infringe nuestras normas de comunidad." });
        }

        const userName = row ? row.name : (req.user.name || 'Usuario');

        db.run(`INSERT INTO comments (id, userId, userName, targetId, parentId, content, likes, createdAt) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
            [commentId, req.user.email, userName, targetId, parentId || null, content, createdAt],
            function (err) {
                if (err) return res.status(400).json({ error: err.message });
                res.json({ message: "Comment added", comment: { id: commentId, userId: req.user.email, userName, targetId, parentId, content, likes: 0, createdAt } });
            }
        );
    });
});

app.post('/api/comments/:id/like', authenticateToken, (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.email;

    // Check if already liked
    db.get(`SELECT * FROM comment_likes WHERE userId = ? AND commentId = ?`, [userId, commentId], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });

        if (row) {
            // Unlike
            db.run(`DELETE FROM comment_likes WHERE userId = ? AND commentId = ?`, [userId, commentId], (err) => {
                if (err) return res.status(400).json({ error: err.message });
                db.run(`UPDATE comments SET likes = likes - 1 WHERE id = ?`, [commentId]);
                res.json({ message: "Unliked", liked: false });
            });
        } else {
            // Like
            db.run(`INSERT INTO comment_likes (userId, commentId) VALUES (?, ?)`, [userId, commentId], (err) => {
                if (err) return res.status(400).json({ error: err.message });
                db.run(`UPDATE comments SET likes = likes + 1 WHERE id = ?`, [commentId]);
                res.json({ message: "Liked", liked: true });
            });
        }
    });
});

app.delete('/api/comments/:id', authenticateToken, (req, res) => {
    const commentId = req.params.id;
    const userEmail = req.user.email;
    const isAdmin = req.user.isAdmin;

    db.get('SELECT * FROM comments WHERE id = ?', [commentId], (err, comment) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.userId !== userEmail && !isAdmin) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        db.run('DELETE FROM comments WHERE id = ? OR parentId = ?', [commentId, commentId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Comment deleted' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
