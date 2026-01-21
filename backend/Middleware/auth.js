const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};


const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};


const checkUserAccess = (req, res, next) => {
    // ensure if user's role is admin
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    // Allow if admin or accessing own profile
    if (req.user.role === 'admin' || req.user.id === req.params.id) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Access denied'
    });
};

module.exports = {
    authenticate,
    authorize,
    checkUserAccess
};