// routes/authRoutes.js
import express from 'express';
import { ldapService } from '../services/ldapService.js';

const router = express.Router();

// Authentication endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log("username",username);
    console.log("password", password);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const user = await ldapService.authenticate(username, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await ldapService.findAllUsers();
    res.json({
      success: true,
      users: users.map(user => user.toJSON())
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Create new user
router.post('/users', async (req, res) => {
  try {
    const user = await ldapService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

// Get user by username
router.get('/users/:username', async (req, res) => {
  try {
    const user = await ldapService.findUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

export default router;