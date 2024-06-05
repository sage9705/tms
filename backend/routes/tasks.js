const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const { check, validationResult } = require('express-validator');

module.exports = function(io) {
    // @route   POST /api/tasks
    // @desc    Create a task
    // @access  Private
    router.post(
        '/',
        [
            auth,
            [
                check('title', 'Title is required').not().isEmpty(),
                check('category', 'Category is required').not().isEmpty(),
                check('priority', 'Priority must be Low, Medium, or High').isIn(['Low', 'Medium', 'High']),
                check('deadline', 'Deadline must be a valid date').optional().isISO8601(),
            ],
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { title, description, category, priority, deadline, status } = req.body;

            try {
                const newTask = new Task({
                    title,
                    description,
                    category,
                    priority,
                    deadline,
                    status,
                    user: req.user.id,
                });

                const task = await newTask.save();
                io.emit('taskCreated', task); // Emit event for task creation
                res.json(task);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        }
    );

    // @route   GET /api/tasks
    // @desc    Get all tasks for the logged-in user
    // @access  Private
    router.get('/', auth, async (req, res) => {
        try {
            const tasks = await Task.find({ user: req.user.id });
            res.json(tasks);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

    // @route   GET /api/tasks/:id
    // @desc    Get task by ID
    // @access  Private
    router.get('/:id', auth, async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);

            if (!task) {
                return res.status(404).json({ msg: 'Task not found' });
            }

            // Ensure the user owns the task
            if (task.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            res.json(task);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Task not found' });
            }
            res.status(500).send('Server error');
        }
    });

    // @route   PUT /api/tasks/:id
    // @desc    Update a task
    // @access  Private
    router.put(
        '/:id',
        [
            auth,
            [
                check('priority', 'Priority must be Low, Medium, or High').optional().isIn(['Low', 'Medium', 'High']),
                check('deadline', 'Deadline must be a valid date').optional().isISO8601(),
            ],
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { title, description, category, priority, deadline, status } = req.body;

            // Build task object
            const taskFields = {};
            if (title) taskFields.title = title;
            if (description) taskFields.description = description;
            if (category) taskFields.category = category;
            if (priority) taskFields.priority = priority;
            if (deadline) taskFields.deadline = deadline;
            if (status) taskFields.status = status;

            try {
                let task = await Task.findById(req.params.id);

                if (!task) {
                    return res.status(404).json({ msg: 'Task not found' });
                }

                // Ensure the user owns the task
                if (task.user.toString() !== req.user.id) {
                    return res.status(401).json({ msg: 'User not authorized' });
                }

                task = await Task.findByIdAndUpdate(
                    req.params.id,
                    { $set: taskFields },
                    { new: true }
                );

                io.emit('taskUpdated', task); // Emit event for task update
                res.json(task);
            } catch (err) {
                console.error(err.message);
                if (err.kind === 'ObjectId') {
                    return res.status(404).json({ msg: 'Task not found' });
                }
                res.status(500).send('Server error');
            }
        }
    );

    // @route   DELETE /api/tasks/:id
    // @desc    Delete a task
    // @access  Private
    router.delete('/:id', auth, async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);

            if (!task) {
                return res.status(404).json({ msg: 'Task not found' });
            }

            // Ensure the user owns the task
            if (task.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            await task.remove();
            io.emit('taskDeleted', task._id); // Emit event for task deletion
            res.json({ msg: 'Task removed' });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Task not found' });
            }
            res.status(500).send('Server error');
        }
    });

    // @route   GET /api/tasks/search
    // @desc    Search and filter tasks
    // @access  Private
    router.get('/search', auth, async (req, res) => {
        const { title, category, priority, status } = req.query;

        // Build query object
        let query = { user: req.user.id };

        if (title) {
            query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        }
        if (category) {
            query.category = category;
        }
        if (priority) {
            query.priority = priority;
        }
        if (status) {
            query.status = status;
        }

        try {
            const tasks = await Task.find(query);
            res.json(tasks);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

    return router;
};
