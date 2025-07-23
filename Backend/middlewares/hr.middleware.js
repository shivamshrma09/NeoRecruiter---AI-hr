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
        
        // Special case for demo token
        if (token && token.startsWith('demo-token-')) {
            // Use demo user for testing
            req.user = demoHrUser;
            return next();
        }
        
        // If no token is provided, return unauthorized error
        if (!token) {
            return res.status(401).json({ message: 'Authentication required. Please login.' });
        }

        // Check if token is blacklisted
        try {
            const isBlacklisted = await BlackListTokenModel.findOne({ token });
            if (isBlacklisted) {
                return res.status(401).json({ message: 'Token expired or invalid. Please login again.' });
            }
        } catch (dbError) {
            console.error('Database error checking blacklist:', dbError);
            // Continue without checking blacklist if database is unavailable
        }
        
        // Verify token
        const jwtSecret = process.env.JWT_SECRET || '6e028a98d85a0c5db8dc5bba696f26a3cf3c801380fee7471466886ec9b69be6';
        
        try {
            const decoded = jwt.verify(token, jwtSecret);
            
            // Find user by ID
            try {
                const user = await hrModel.findById(decoded._id);
                if (user) {
                    // Set user in request object
                    req.user = user;
                    return next();
                }
            } catch (dbError) {
                console.error('Database error finding user:', dbError);
                // If database is unavailable, use demo user
                if (decoded._id === 'demo123' || decoded.email === 'interview123@gmail.com') {
                    req.user = demoHrUser;
                    return next();
                }
            }
            
            // If we get here, user was not found
            return res.status(404).json({ message: 'User not found' });
            
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
        
        // Use demo user as fallback in case of server error
        if (req.headers?.['x-demo-mode'] === 'true' || req.query?.demo === 'true') {
            req.user = demoHrUser;
            return next();
        }
        
        return res.status(500).json({ message: 'Server error during authentication', error: err.message });
    }
}