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
        
        // Check if user already exists
        const existingUser = await hrModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        
        try {
            // Create new HR user with default 1000 rupees balance
            const newUser = await hrService.createHr({ companyName, email, password });
            
            // Generate authentication token
            const token = newUser.generateAuthToken();
            
            // Set token in cookie for better security
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production'
            });
            
            res.status(201).json({
                message: 'Registration successful',
                user: {
                    _id: newUser._id,
                    companyName: newUser.companyName,
                    email: newUser.email,
                    Balance: newUser.Balance
                },
                token: token
            });
        } catch (createError) {
            console.error('User creation error:', createError);
            return res.status(500).json({ message: 'Failed to create user', error: createError.message });
        }
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

exports.loginHr = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        
        // Special handling for demo account
        if (email === 'interview123@gmail.com' && password === 'interv@123') {
            try {
                // Try to find demo user in database
                let demoUser = await hrModel.findOne({ email: 'interview123@gmail.com' });
                
                if (!demoUser) {
                    try {
                        // Create demo user if it doesn't exist
                        const hashedPassword = await hrModel.hashPassword('interv@123');
                        demoUser = await hrModel.create({
                            companyName: 'NeoRecruiter Demo',
                            email: 'interview123@gmail.com',
                            password: hashedPassword,
                            Balance: 1000,
                            interviews: []
                        });
                    } catch (createError) {
                        console.error('Error creating demo user:', createError);
                        return res.status(500).json({ message: 'Error creating demo user' });
                    }
                }
                
                // Generate token
                const jwtSecret = process.env.JWT_SECRET || '6e028a98d85a0c5db8dc5bba696f26a3cf3c801380fee7471466886ec9b69be6';
                const token = jwt.sign({ _id: demoUser._id, email: demoUser.email }, jwtSecret, { expiresIn: '1d' });
                
                // Set token in cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                    sameSite: 'none',
                    secure: process.env.NODE_ENV === 'production'
                });
                
                return res.status(200).json({
                    message: 'Login successful',
                    user: {
                        _id: demoUser._id,
                        companyName: demoUser.companyName,
                        email: demoUser.email,
                        Balance: demoUser.Balance
                    },
                    token: token
                });
            } catch (demoError) {
                console.error('Error with demo login:', demoError);
                return res.status(500).json({ message: 'Demo login failed', error: demoError.message });
            }
        } else {
            try {
                // Find user by email
                const user = await hrModel.findOne({ email }).select('+password');
                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                
                // Verify password
                const isPasswordValid = await user.comparePassword(password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                
                // Generate authentication token
                const token = user.generateAuthToken();
                
                // Set token in cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                    sameSite: 'none',
                    secure: process.env.NODE_ENV === 'production'
                });
                
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
            } catch (dbError) {
                console.error('Database error during login:', dbError);
                return res.status(500).json({ message: 'Login failed due to server error', error: dbError.message });
            }
        }
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
            _id: user._id || 'demo123',
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