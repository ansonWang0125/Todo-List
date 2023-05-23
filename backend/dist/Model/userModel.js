"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('Users', {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, { timestamps: true });
    return User;
};
//# sourceMappingURL=userModel.js.map