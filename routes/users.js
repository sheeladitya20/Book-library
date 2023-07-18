const express = require('express');
const router = express.Router();
const User = require('../models/user');

//create user
router.post('/', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Create the user
      const user = await User.create({ email, password });
  
      res.status(201).json({user});
    } catch (error) {
      console.error('Error while creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


  //Get all users (Read operation):
  router.get('/', async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error('Error while retrieving users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  
  //Get a specific user by ID (Read operation):
  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error while retrieving user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  

  //Update a specific user by ID (Update operation):
  router.put('/:id', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the user
      user.email = email;
      user.password = password;
      await user.save();
  
      res.json(user);
    } catch (error) {
      console.error('Error while updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  
  //Delete a specific user by ID (Delete operation):
  router.delete('/:id', async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Delete the user
      await user.destroy();
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error while deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  
  module.exports=router;