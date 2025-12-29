import express from 'express';
import logger from 'morgan';

import { Server } from 'socket.io';
import {createServer} from 'http';

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app); // Creamos el servidor HTTP
const io = new Server(server); // Inicializamos Socket.IO con el servidor HTTP

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    socket.on('chat message', (msg) => {
        // console.log('Mensaje recibido: '+ msg);
        io.emit('chat message', msg); // Reenviamos el mensaje a todos los clientes conectados
    });
});

app.use(logger('dev')); // Middleware de logging

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html'); // Servimos el archivo HTML
});

server.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
});