const hrService = require('../services/hr.service');
const hrModel = require('../models/hr.model');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const BlackListTokenModel = require('../models/black.list.token.model');
exports.RegisterHr = async (req, res) => {
    try {
        const { companyName, email, password } = req.body;
        console.log('Registration attempt:', { companyName, email, password: '***' });
        if (!companyName || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'All fields required' });
        }
        if (companyName.length < 3) {
            return res.status(400).json({ message: 'Company name must be at least 3 characters' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        console.log('Checking if user exists...');
        const existingUser = await hrModel.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        console.log('Creating new user...');
        const newUser = await hrService.createHr({ companyName, email, password });
        console.log('User created successfully:', newUser._id);
        const token = newUser.generateAuthToken();
        console.log('Token generated for new user');
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production'
        });
        console.log('Registration successful for:', email);
        res.status(201).json({
            message: 'Registration successful',
            user: {
                _id: newUser._id,
                companyName: newUser.companyName,
                email: newUser.email,
                Balance: newUser.Balance || 1000
            },
            token: token
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};
exports.loginHr = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password: '***' });
        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ message: 'Email and password required' });
        }
        console.log('Searching for user with email:', email);
        const user = await hrModel.findOne({ email }).select('+password');
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log('User found, comparing password...');
        const isPasswordValid = await user.comparePassword(password);
        console.log('Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log('Generating token...');
        const token = user.generateAuthToken();
        console.log('Token generated successfully');
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production'
        });
        console.log('Login successful for user:', email);
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                companyName: user.companyName,
                email: user.email,
                Balance: user.Balance
            },
            token: token
        });
    } catch (err) {
        console.error('Login error:', err);
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
            email: user.email,
            Balance: user.Balance || 1000
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
