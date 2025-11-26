const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now (dev mode)
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join-room', (roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        const numClients = room ? room.size : 0;

        if (numClients >= 2) {
            socket.emit('room-full');
            console.log(`Room ${roomId} is full. Rejected ${socket.id}`);
        } else {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);

            // Notify others in the room
            socket.to(roomId).emit('user-connected', socket.id);

            // If room now has 2 people, let them know ready to start
            if (numClients + 1 === 2) {
                io.to(roomId).emit('room-ready');
            }
        }
    });

    socket.on('offer', (payload) => {
        io.to(payload.target).emit('offer', payload);
    });

    socket.on('answer', (payload) => {
        io.to(payload.target).emit('answer', payload);
    });

    socket.on('ice-candidate', (payload) => {
        io.to(payload.target).emit('ice-candidate', payload);
    });

    socket.on('cinema-mode-change', ({ roomId, mode }) => {
        io.to(roomId).emit('cinema-mode-change', { mode });
    });

    socket.on('send-reaction', (payload) => {
        io.to(payload.roomId).emit('receive-reaction', payload);
    });

    socket.on('change-theme', (payload) => {
        io.to(payload.roomId).emit('update-theme', payload);
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.to(roomId).emit('user-disconnected', socket.id);
        });
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Signaling server running on port ${PORT}`);
});
