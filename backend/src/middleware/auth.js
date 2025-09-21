const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { AppError } = require('./errorHandler');

const authenticate = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new AppError('Access denied. No token provided.', 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db('users').select('id', 'first_name', 'last_name', 'email', 'phone', 'role', 'status').where({ id: decoded.id }).first();
    if (!user) {
      throw new AppError('Invalid token. User not found.', 401);
    }
    if (user.status !== 'active') {
      throw new AppError('Account is not active.', 401);
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token.', 401);
    } else if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expired.', 401);
    }
    throw error;
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Access denied. Please authenticate first.', 401);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError('Access denied. Insufficient permissions.', 403);
    }
    next();
  };
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = {
  authenticate,
  authorize,
  generateToken
};
