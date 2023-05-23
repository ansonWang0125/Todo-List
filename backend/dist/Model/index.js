"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//importing modules
// import { Sequelize, DataTypes, Options, Dialect } from 'sequelize'
const sequelize_1 = require("sequelize");
const dotenv_defaults_1 = __importDefault(require("dotenv-defaults"));
dotenv_defaults_1.default.config();
const dialectValue = process.env.database;
const sequelizeOptions = {
    dialect: dialectValue,
};
console.log("dialect = ", process.env.database);
// const sequelize = new Sequelize(`postgres://${process.env.user}:${process.env.password}@${process.env.host}:${process.env.dbport}/${process.env.databaseName}`, {dialect: process.env.database})
const sequelize = new sequelize_1.Sequelize(`postgres://${process.env.user}:${process.env.password}@127.0.0.1:${process.env.dbport}/${process.env.databaseName}`, sequelizeOptions);
// const sequelize = new Sequelize(process.env.url, {dialect: process.env.database})
// checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`Database connected to discover`);
}).catch((err) => {
    console.log(err);
});
const db = {}; // Using 'any' for simplicity, you can define a more specific type for 'db'
db.Sequelize = sequelize_1.Sequelize;
db.sequelize = sequelize;
//connecting to model
db.users = require('./usersModel').default(sequelize, sequelize_1.DataTypes);
db.recipe = require('./recipesModel').default(sequelize, sequelize_1.DataTypes);
db.categories = require('./categoriesModel').default(sequelize, sequelize_1.DataTypes);
db.ingredients = require('./ingredientsModel').default(sequelize, sequelize_1.DataTypes);
db.labels = require('./labelsModel').default(sequelize, sequelize_1.DataTypes);
db.users.hasMany(db.recipe, { foreignKey: "userID", targetKey: "id", onDelete: 'cascade' });
db.categories.hasMany(db.ingredients, { foreignKey: "categoryID", targetKey: "id", onDelete: 'cascade' });
//exporting the module
exports.default = db;
//new Sequelize(`postgres://${process.env.user}:${process.env.password}@127.0.0.1:${process.env.dbport}/${process.env.databaseName}`, {dialect: process.env.database})
//# sourceMappingURL=index.js.map