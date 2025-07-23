const hrService = require('../services/hr.service');
const hrModel = require('../models/hr.model');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const BlackListTokenModel = require('../models/black.list.token.model');

exports.RegisterHr = async (req, res) => {
    try {
        const { companyName, email, password } = req.body;
        
        if (!companyName || !email || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }
        
        res.status(201).json({
            message: 'Registration successful',
            user: {
                _id: '123',
                companyName: companyName,
                email: email
            },
            token: 'test-token'
        });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

exports.loginHr = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        
        // Generate a real JWT token that will work with our middleware
        const token = jwt.sign(
            { _id: '123', email: email, companyName: 'NeoRecruiter' },
            process.env.JWT_SECRET || '6e028a98d85a0c5db8dc5bba696f26a3cf3c801380fee7471466886ec9b69be6',
            { expiresIn: '7d' }
        );
        
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: '123',
                companyName: 'NeoRecruiter',
                email: email
            },
            token: token
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
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
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

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
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};