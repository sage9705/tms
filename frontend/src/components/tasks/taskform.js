import React, { useState } from 'react';
import { useTasks } from '../../contexts/TaskContext';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('');
    const [deadline, setDeadline] = useState('');
    const [status, setStatus] = useState('');
    const { createTask } = useTasks();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTask({ title, description, category, priority, deadline, status });
        setTitle('');
        setDescription('');
        setCategory('');
        setPriority('');
        setDeadline('');
        setStatus('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Task</h2>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>Description:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label>Category:</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div>
                <label>Priority:</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                    <option value="">Select</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <div>
                <label>Deadline:</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div>
                <label>Status:</label>
                <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
            </div>
            <button type="submit">Create</button>
        </form>
    );
};

export default TaskForm;
