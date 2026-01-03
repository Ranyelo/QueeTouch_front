const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'queentouch.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Helper to hash password
const hashPassword = (password) => {
    return bcrypt.hashSync(password, 8);
};

db.serialize(() => {
    // 1. Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        role TEXT DEFAULT 'user',
        tier TEXT,
        points INTEGER DEFAULT 0,
        isAdmin INTEGER DEFAULT 0,
        isVerified INTEGER DEFAULT 0,
        verificationCode TEXT,
        resetToken TEXT,
        resetExpires TEXT
    )`);

    // 2. Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        price INTEGER,
        description TEXT,
        category TEXT,
        subcategory TEXT,
        images TEXT, -- JSON string
        colors TEXT, -- JSON string
        stock INTEGER
    )`);

    // 3. Orders Table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT,
        date TEXT,
        total INTEGER,
        status TEXT, -- processing, shipped, delivered
        shippingMethod TEXT,
        trackingNumber TEXT,
        estimatedArrival TEXT,
        items TEXT -- JSON string
    )`);

    // 4. Distributor Applications
    db.run(`CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        userId TEXT, -- email
        fullName TEXT,
        businessName TEXT,
        address TEXT,
        city TEXT,
        phone TEXT,
        experience TEXT,
        capital TEXT,
        status TEXT,
        date TEXT
    )`);

    // 5. Tickets (Support)
    db.run(`CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        userId TEXT,
        subject TEXT,
        message TEXT,
        response TEXT,
        status TEXT,
        date TEXT
    )`);

    // 6. Comments Table
    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        userId TEXT,
        userName TEXT,
        targetId TEXT,
        parentId TEXT,
        content TEXT,
        likes INTEGER DEFAULT 0,
        createdAt TEXT
    )`);

    // 7. Comment Likes Table (for unique likes)
    db.run(`CREATE TABLE IF NOT EXISTS comment_likes (
        userId TEXT,
        commentId TEXT,
        PRIMARY KEY (userId, commentId)
    )`);

    // --- SEED DATA ---

    // Seed Users
    const adminPass = hashPassword('admin123'); // Default password for demo
    db.run(`INSERT OR IGNORE INTO users (email, password, name, role, isAdmin, isVerified) VALUES ('admin@queentouch.com', ?, 'Admin', 'admin', 1, 1)`, [adminPass]);

    // Seed Products (From Initial State)
    const initialProducts = [
        {
            id: 'p1',
            name: 'Esmalte Gel Red Velvet',
            price: 25000,
            description: 'Esmalte de larga duración con acabado brillante. Ideal para uso profesional.',
            category: 'esmaltes',
            subcategory: 'lisos',
            images: JSON.stringify(['https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop']),
            colors: JSON.stringify(['#FF0000', '#8B0000', '#DC143C', '#B22222']),
            stock: 100
        },
        {
            id: 'p2',
            name: 'Lámpara UV LED Pro 48W',
            price: 150000,
            description: 'Secado rápido para todo tipo de geles. Sensor automático y temporizador.',
            category: 'equipos',
            subcategory: 'lamparas',
            images: JSON.stringify(['https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop']),
            colors: JSON.stringify(['#FFFFFF']),
            stock: 3
        },
        {
            id: 'p3',
            name: 'Kit Pinceles Nail Art',
            price: 45000,
            description: 'Set de 5 pinceles de precisión para mano alzada y detalles finos.',
            category: 'pinceles',
            subcategory: 'arte',
            images: JSON.stringify(['https://images.unsplash.com/photo-1599693918340-02543d3b7338?q=80&w=800&auto=format&fit=crop']),
            colors: JSON.stringify([]),
            stock: 15
        },
        {
            id: 'p4',
            name: 'Aceite de Cutícula Orgánico',
            price: 12000,
            description: 'Hidratación profunda con vitamina E y aroma a almendras.',
            category: 'spa',
            subcategory: 'cuidados',
            images: JSON.stringify(['https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop']),
            colors: JSON.stringify([]),
            stock: 50
        }
    ];

    const stmt = db.prepare("INSERT OR IGNORE INTO products (id, name, price, description, category, subcategory, images, colors, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    initialProducts.forEach(p => {
        stmt.run(p.id, p.name, p.price, p.description, p.category, p.subcategory, p.images, p.colors, p.stock);
    });
    stmt.finalize();

});

module.exports = db;
