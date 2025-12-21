import sequelize from '../config/database';
import User from './User';
import Product from './Product';

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Set force: true to drop tables on startup (dev only)
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

export { User, Product, syncDatabase };
