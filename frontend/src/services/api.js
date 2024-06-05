import axios from 'axios';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

socket.on('taskCreated', (task) => {
    console.log('New task created:', task);
    // Handle task created notification
});

socket.on('taskUpdated', (task) => {
    console.log('Task updated:', task);
    // Handle task updated notification
});

socket.on('taskDeleted', (taskId) => {
    console.log('Task deleted:', taskId);
    // Handle task deleted notification
});

export { api, socket };
