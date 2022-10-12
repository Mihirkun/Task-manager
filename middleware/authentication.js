const User = require('../model/User');
const jwt = require('jsonwebtoken');
const createCustomError = require('../errors/custom-error');


const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(createCustomError(`Authentication : ${taskID}`, 404));
    // throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    return next(createCustomError(`Authentication : ${taskID}`, 404));

    // throw new UnauthenticatedError('Authentication invalid')
  }
};

module.exports = auth;
