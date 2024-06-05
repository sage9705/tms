import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, socket } from '../services/api';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await api.get('/api/tasks', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTasks(res.data);
        };

        fetchTasks();
    }, []);

    useEffect(() => {
        socket.on('taskCreated', (task) => {
            setTasks((prevTasks) => [...prevTasks, task]);
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
            );
        });

        socket.on('taskDeleted', (taskId) => {
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        });
    }, []);

    const createTask = async (task) => {
        const res = await api.post('/api/tasks', task, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setTasks((prevTasks) => [...prevTasks, res.data]);
    };

    const updateTask = async (id, updates) => {
        const res = await api.put(`/api/tasks/${id}`, updates, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setTasks((prevTasks) => prevTasks.map((task) => (task._id === id ? res.data : task)));
    };

    const deleteTask = async (id) => {
        await api.delete(`/api/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    };

    return (
        <TaskContext.Provider value={{ tasks, createTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};
