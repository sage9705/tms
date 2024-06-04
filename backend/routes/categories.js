const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/category');

// @route   POST /api/categories
// @desc    Create a category
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name } = req.body;

    try {
        let category = await Category.findOne({ name, user: req.user.id });

        if (category) {
            return res.status(400).json({ msg: 'Category already exists' });
        }

        category = new Category({
            name,
            user: req.user.id,
        });

        await category.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/categories
// @desc    Get all categories for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name } = req.body;

    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // Ensure the user owns the category
        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        category.name = name;

        await category.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // Ensure the user owns the category
        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await category.remove();
        res.json({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;
