const hrModel = require('../models/hr.model');
const jwt = require('jsonwebtoken');
const BlackListTokenModel = require('../models/black.list.token.model');
const { demoHrUser } = require('../utils/demoData');

module.exports.authHr = async (req, res, next) => {
    try {
        // Special case for demo login
        if (req.body?.email === 'interview123@gmail.com' && req.body?.password === 'interv@123') {
            // Allow demo login to proceed without token
            if (req.path === '/login') {
                return next();
            }
        }

        // Get token from headers or cookies
        let token = req.cookies?.token || null;
        
        // Check Authorization header if token not in cookies
        const authHeader = req.headers?.authorization;
        if (!token && authHeader) {
            // Handle both "Bearer token" and just "token" formats
            token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        }
        
        // If no token is provided, return unauthorized error
        if (!token) {
            return res.status(401).json({ message: 'Authentication required. Please login.' });
        }
        
        // Verify token
        const jwtSecret = process.env.JWT_SECRET || '6e028a98d85a0c5db8dc5bba696f26a3cf3c801380fee7471466886ec9b69be6';
        
        try {
            const decoded = jwt.verify(token, jwtSecret);
            
            // Check if token is blacklisted
            const isBlacklisted = await BlackListTokenModel.findOne({ token });
            if (isBlacklisted) {
                return res.status(401).json({ message: 'Token has been invalidated. Please login again.' });
            }
            
            // Special case for demo user
            if (decoded.email === 'interview123@gmail.com') {
                req.user = demoHrUser;
                return next();
            }
            
            // Find user by ID from token
            const user = await hrModel.findById(decoded._id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            req.user = user;
            return next();
            
        } catch (tokenError) {
            // Handle token verification errors
            if (tokenError.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token. Please login again.' });
            } else if (tokenError.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired. Please login again.' });
            } else {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
        }
    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(500).json({ message: 'Server error during authentication', error: err.message });
    }
}