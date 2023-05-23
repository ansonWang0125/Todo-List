// require('dotenv').config();
import dotenv from "dotenv-defaults";
dotenv.config();
import db from './Model';

console.log("dotenv = ", process.env.port)
const PORT = process.env.port || 8000

import express, { json, urlencoded } from "express";
const app = express();
import cors from 'cors';
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));


app.use(json());
app.use(urlencoded());


// db.sequelize.sync({ alter: true }).then(() => {    //drop table if exists
//     console.log("db has been sync")
// })

db.sequelize.sync().then(() => {    //drop table if exists
  console.log("db has been sync")
})


// app.use(express.static(path.join(__dirname, "..", "..", "frontend", "build")));
// app.get("/*", (_, res) => {
//   res.sendFile(path.join(__dirname,"..","..", "frontend", "build", "index.html"));
// });

try {
  app.listen(PORT, () => {
    console.log("Server listening on Port", PORT);
  });
} catch (err) {
  console.error("Error in server setup:", err);
}