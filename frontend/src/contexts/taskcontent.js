import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await axios.get('/api/tasks', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTasks(res.data);
        };

        fetchTasks();
    }, []);

    const createTask = async (task) => {
        const res = await axios.post('/api/tasks', task, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setTasks([...tasks, res.data]);
    };

    const updateTask = async (id, updates) => {
        const res = await axios.put(`/api/tasks/${id}`, updates, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    };

    const deleteTask = async (id) => {
        await axios.delete(`/api/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setTasks(tasks.filter((task) => task._id !== id));
    };

    return (
        <TaskContext.Provider value={{ tasks, createTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};
