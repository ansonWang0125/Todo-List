//importing modules
// import { Sequelize, DataTypes, Options, Dialect } from 'sequelize'
import { Sequelize, DataTypes, Options, Dialect } from 'sequelize'
import dotenv from "dotenv-defaults";
dotenv.config();

const dialectValue = process.env.database;

const sequelizeOptions: Options = {
    dialect: dialectValue as Dialect,
  };

console.log("dialect = ", process.env.database)
// const sequelize = new Sequelize(`postgres://${process.env.user}:${process.env.password}@${process.env.host}:${process.env.dbport}/${process.env.databaseName}`, {dialect: process.env.database})
const sequelize = new Sequelize(`postgres://${process.env.user}:${process.env.password}@127.0.0.1:${process.env.dbport}/${process.env.databaseName}`, sequelizeOptions)
// const sequelize = new Sequelize(process.env.url, {dialect: process.env.database})
// checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`Database connected to discover`)
}).catch((err) => {
    console.log(err)
})

const db: any = {} // Using 'any' for simplicity, you can define a more specific type for 'db'
db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.users = require('./usersModel').default (sequelize, DataTypes)
db.tasks = require('./tasksModel').default (sequelize, DataTypes)
db.comments = require('./commentsModel').default (sequelize, DataTypes)
db.users.hasMany(db.tasks, {foreignKey: "userID", targetKey: "id", onDelete: 'cascade'})
db.users.hasMany(db.comments, {foreignKey: "userID", targetKey: "id", onDelete: 'cascade'})
db.tasks.hasMany(db.comments, {foreignKey: "taskID", targetKey: "id", onDelete: 'cascade'})

//exporting the module
export default db
//new Sequelize(`postgres://${process.env.user}:${process.env.password}@127.0.0.1:${process.env.dbport}/${process.env.databaseName}`, {dialect: process.env.database})
