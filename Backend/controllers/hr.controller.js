const hrService = require('../services/hr.service');
const hrModel = require('../models/hr.model');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const BlackListTokenModel = require('../models/black.list.token.model');

// HR Registration
exports.RegisterHr = async (req, res) => {
    try {
        console.log('Register attempt:', req.body);
        
        const { companyName, email, password } = req.body;
        
        if (!companyName || !email || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }
        
        // Simple test response
        res.status(201).json({
            message: 'Registration test successful',
            user: {
                _id: '123',
                companyName: companyName,
                email: email
            },
            token: 'test-token'
        });
        
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};








































// HR Login
exports.loginHr = async (req, res) => {
    try {
        console.log('Login attempt:', req.body);
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        
        // Simple response for testing
        res.status(200).json({
            message: 'Login test successful',
            user: {
                _id: '123',
                companyName: 'Test Company',
                email: email
            },
            token: 'test-token'
        });
        
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

// HR Profile (Protected Route)
exports.getProfile = async (req, res) => {
    try {
        // req.user middleware से आता है
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            _id: user._id,
            companyName: user.companyName,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// HR Logout (Token Blacklist)
exports.logoutHr = async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'Token missing' });
        }
        await BlackListTokenModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};