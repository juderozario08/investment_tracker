import express, { type Request, type Response } from 'express';
import http from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server)

const port = 8080;

io.on('connection', (socket) => {
    console.log('Client connected: ', socket.id)
    socket.on('message', (msg) => {
        console.log('Received message:', msg);
        io.emit("message", msg);
    })
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
})

app.get('/', (_req: Request, res: Response) => {
    res.json({
        status: 'ok',
        message: 'Hello World!'
    })
})

server.listen(port, () => {
    console.log('Listening on port: ', port)
})
