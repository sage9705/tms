import React from 'react';
import { useTasks } from '../../contexts/TaskContext';
import TaskItem from './taskitem';
import TaskForm from './TaskForm';

const TaskList = () => {
    const { tasks } = useTasks();

    return (
        <div>
            <h1>Task List</h1>
            <TaskForm />
            <ul>
                {tasks.map(task => (
                    <TaskItem key={task._id} task={task} />
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
