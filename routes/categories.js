const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// Get All Categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error while retrieving categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a Category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error while creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
