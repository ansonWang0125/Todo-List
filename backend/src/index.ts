// require('dotenv').config();
import dotenv from "dotenv-defaults";
dotenv.config();
import db from './Model';
import userRoutes from './Routes/userRoute';
import taskRoutes from './Routes/taskRoute';
import { Server } from 'socket.io';
import http from 'http';
import { configureSocket } from './Sockets/socketLogic';

console.log("dotenv = ", process.env.port)
const PORT = process.env.port || 8080

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

app.use('/api/user', userRoutes)
app.use('/api/task', taskRoutes);

// app.use(express.static(path.join(__dirname, "..", "..", "frontend", "build")));
// app.get("/*", (_, res) => {
//   res.sendFile(path.join(__dirname,"..","..", "frontend", "build", "index.html"));
// });


// db.sequelize.sync({ force: true }).then(() => {    //drop table if exists
//     console.log("db has been sync")
// })

db.sequelize.sync().then(() => {    //drop table if exists
  console.log("db has been sync")
})

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

configureSocket(io);

try {
  server.listen(PORT, () => {
    console.log("Server listening on Port", PORT);
  });
} catch (err) {
  console.error("Error in server setup:", err);
}