const hrModel = require('../models/hr.model');
const jwt = require('jsonwebtoken');
const BlackListTokenModel = require('../models/black.list.token.model');

module.exports.authHr = async (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    const isBlacklisted = await BlackListTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized: Token blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // JWT में id या _id जो भी है, उसे verify करो
        const user = await hrModel.findById(decoded._id || decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
} 