import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
    id?: number;
    email: string;
    password?: string;
    name: string;
    isAdmin: boolean;
    role: 'user' | 'member' | 'ambassador' | 'admin' | 'distributor';
    tier?: 'bronze' | 'silver' | 'gold';
    points?: number;
}

class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public name!: string;
    public isAdmin!: boolean;
    public role!: 'user' | 'member' | 'ambassador' | 'admin' | 'distributor';
    public tier?: 'bronze' | 'silver' | 'gold';
    public points?: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user',
        },
        tier: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export default User;
