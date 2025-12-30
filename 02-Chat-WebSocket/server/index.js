import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

import { Server } from 'socket.io';
import {createServer} from 'http';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app); // Creamos el servidor HTTP
const io = new Server(server, {  // Inicializamos Socket.IO con el servidor HTTP
  connectionStateRecovery: {} // Habilitamos la recuperación del estado de conexión
});

// Creamos una conexión a la base de datos de TURSO
const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
});

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      user TEXT
  );
`)

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejamos la desconexión del cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    // Escuchamos el evento 'chat message' enviado por los clientes
    socket.on('chat message', async (msg) => {
        let result
        let username = socket.handshake.auth.username ?? 'Anonimo'; // Obtenemos el nombre de usuario del cliente o usamos 'Anonimo' por defecto
        try {
          // Insertamos el mensaje en la base de datos
          result = await db.execute({
            sql: 'INSERT INTO messages (content, user) VALUES (:msg, :username)', // Usamos la instrucción SQL con un parámetro nombrado
            args: { msg, username } // Pasamos el valor del parámetro
          })
        } catch (error) {
          console.error('Error al insertar el mensaje en la base de datos:', error);
          return;
        }
        // Emitimos el mensaje a todos los clientes conectados junto con su ID
        io.emit('chat message', msg, result.lastInsertRowid.toString(), username);
    });

    if(!socket.recovered){
      // Si la conexión no fue recuperada, enviamos los mensajes previos
      try {
        // Obtenemos los mensajes desde la base de datos
        const result = await db.execute({
          sql: 'SELECT id, content, user FROM messages WHERE id > ?',
          args: [socket.handshake.auth.serverOffset ?? 0] // Usamos el serverOffset proporcionado por el cliente
        });

        // Enviamos cada mensaje al cliente
        result.rows.forEach(row => {
          // Emitimos el mensaje junto con su ID
          socket.emit('chat message', row.content, row.id.toString(), row.user);
        })
      } catch (error) {
        
      }
    }
});

app.use(logger('dev')); // Middleware de logging

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html'); // Servimos el archivo HTML
});

server.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
});