import React from 'react';
import { useTasks } from '../../contexts/TaskContext';

const TaskItem = ({ task }) => {
    const { deleteTask } = useTasks();

    const handleDelete = () => {
        deleteTask(task._id);
    };

    return (
        <li>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <button onClick={handleDelete}>Delete</button>
        </li>
    );
};

export default TaskItem;
