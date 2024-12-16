import express from 'express';
const app = express();

import http from 'http';
import { Server } from 'socket.io';

import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import listingRoutes from './routes/listing.route.js';
import authRoutes from './routes/auth.route.js';
import reservationRoutes from './routes/reservation.route.js';
import residentRoutes from './routes/resident.route.js';

dotenv.config({ path: './backend/.env' });
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

// Socket.io configuration
export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'https://canbrs-alpha.vercel.app' || 'https://canbrs.online',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods
    }
});

io.on('connection', (socket) => {
    console.log('Client connected: ', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected: ', socket.id);
    });
});

const allowedOrigins = [
    'https://canbrs-alpha.vercel.app',
    'https://canbrs.online',
    process.env.CLIENT_URL
  ];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/', listingRoutes);
app.use('/auth', authRoutes);
app.use('/', reservationRoutes);
app.use('/', residentRoutes);

server.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});