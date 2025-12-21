import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

import productRoutes from './routes/productRoutes';
app.use('/api/products', productRoutes);

import authRoutes from './routes/authRoutes';
app.use('/api/auth', authRoutes);

import { syncDatabase } from './models';

app.get('/', (req: Request, res: Response) => {
    res.send('Queen Touch Backend is running!');
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await syncDatabase();
});
