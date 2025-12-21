import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            isAdmin: false,
        });
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Cannot find user' });
        }

        if (await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign(
                { email: user.email, id: user.id, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '1d' } // Token expires in 1 day
            );
            res.json({ accessToken, user: { name: user.name, email: user.email, role: user.role } });
        } else {
            res.status(403).json({ message: 'Not Allowed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
