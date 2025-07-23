const hrModel = require('../models/hr.model');
const jwt = require('jsonwebtoken');
const BlackListTokenModel = require('../models/black.list.token.model');

module.exports.authHr = async (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    try {
        // Check if token is blacklisted
        const isBlacklisted = await BlackListTokenModel.findOne({ token }).catch(() => null);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized: Token blacklisted' });
        }

        // Verify token
        const jwtSecret = process.env.JWT_SECRET || '6e028a98d85a0c5db8dc5bba696f26a3cf3c801380fee7471466886ec9b69be6';
        const decoded = jwt.verify(token, jwtSecret);
        
        // For demo purposes, we'll accept any valid token
        // In a real app, we would check if the user exists in the database
        req.user = {
            _id: decoded._id || '123',
            email: decoded.email || 'demo@example.com',
            companyName: 'Test Company'
        };
        
        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
} 