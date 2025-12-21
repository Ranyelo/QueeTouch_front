import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface ProductAttributes {
    id?: string; // Using string ID to match frontend UUIDs usually or we can use auto-increment
    // Frontend uses string ID, let's stick to auto-generated UUIDs or similar if possible, or just string.
    // Generally sequelize defaults to ID usually integer. Let's make it UUID to be safe with "string"
    name: string;
    price: number;
    description: string;
    images: string[];
    colors: string[];
    category: string;
    subcategory: string;
    stock?: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
    public id!: string;
    public name!: string;
    public price!: number;
    public description!: string;
    public images!: string[];
    public colors!: string[];
    public category!: string;
    public subcategory!: string;
    public stock!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        images: {
            type: DataTypes.JSON, // SQLite supports JSON
            defaultValue: [],
        },
        colors: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subcategory: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'products',
    }
);

export default Product;
