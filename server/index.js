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

// Store room passwords in memory (session-based)
const roomPasswords = new Map();

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Room password setup
    socket.on('set-room-password', ({ roomId, password }) => {
        if (password) {
            roomPasswords.set(roomId, password);
            console.log(`Password set for room ${roomId}`);
        }
    });

    // Verify room password
    socket.on('verify-room-password', ({ roomId, password }, callback) => {
        const storedPassword = roomPasswords.get(roomId);

        if (!storedPassword) {
            // No password set for this room
            callback({ success: true });
        } else if (storedPassword === password) {
            callback({ success: true });
        } else {
            callback({ success: false, error: 'Incorrect password' });
        }
    });

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

    // Chat messaging
    socket.on('send-message', (payload) => {
        socket.to(payload.roomId).emit('receive-message', payload);
    });

    // Typing indicators
    socket.on('typing-start', (payload) => {
        socket.to(payload.roomId).emit('typing-start', payload);
    });

    socket.on('typing-stop', (payload) => {
        socket.to(payload.roomId).emit('typing-stop', payload);
    });

    // Kick user
    socket.on('kick-user', ({ roomId, userId }) => {
        io.to(userId).emit('kicked-from-room');
        const targetSocket = io.sockets.sockets.get(userId);
        if (targetSocket) {
            targetSocket.leave(roomId);
        }
    });

    // Synchronized Playback
    socket.on('play-video', (payload) => {
        socket.to(payload.roomId).emit('play-video', payload);
    });

    socket.on('pause-video', (payload) => {
        socket.to(payload.roomId).emit('pause-video', payload);
    });

    socket.on('seek-video', (payload) => {
        socket.to(payload.roomId).emit('seek-video', payload);
    });

    socket.on('sync-request', (payload) => {
        socket.to(payload.roomId).emit('sync-request', payload);
    });

    socket.on('sync-response', (payload) => {
        socket.to(payload.roomId).emit('sync-response', payload);
    });

    socket.on('countdown-start', (payload) => {
        io.to(payload.roomId).emit('countdown-start', payload);
    });

    socket.on('video-url-change', (payload) => {
        socket.to(payload.roomId).emit('video-url-change', payload);
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
