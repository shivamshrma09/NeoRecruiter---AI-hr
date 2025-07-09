const hrService = require('../services/hr.service');
const hrModel = require('../models/hr.model');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const BlackListTokenModel = require('../models/black.list.token.model');

// HR Registration
exports.RegisterHr = async (req, res) => {
    try {
        // Validation errors check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { companyName, email, password } = req.body;
        // Check if user already exists
        const existingUser = await hrModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Create new HR with ₹1000 signup bonus
        const user = await hrService.createHr({ companyName, email, password });
        const token = user.generateAuthToken();

        // Set token in cookie (optional, else send in response)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).json({
            message: 'HR registered successfully!',
            user: {
                _id: user._id,
                companyName: user.companyName,
                email: user.email
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};








































// HR Login
exports.loginHr = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await hrModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                companyName: user.companyName,
                email: user.email,
                Balance: user.Balance || 0
            },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
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
            email: user.email,
            Balance: user.Balance || 0
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