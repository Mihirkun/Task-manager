const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');
// const { StatusCodes } = require('http-status-codes')
const { createCustomError } = require('../errors/custom-error');
// const { create } = require('../model/Task');
// const asyncwrapper = require('../middleware/async');
// var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  password = await bcrypt.hash(password, salt);
  return password;
};

const comparePassword = async (canditatePassword, password) => {
  const isMatch = await bcrypt.compare(canditatePassword, password);
  // console.log(password);
  // console.log(canditatePassword);
  return isMatch;
};

const createJWT = ({ _id, name }) => {
  return jwt.sign({ userId: _id, name: name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const tempUser = { name, email, password: hashPassword };
  const user = await User.create({ ...tempUser });
  // const { password } = req.body;
  // req.body.password = await hashPassword(password);
  // const user = await User.create(req.body);
  const token = createJWT(user);
  res.status(200).json({ user: { name: user.name, email: user.email }, token });
};

const login = async (req, res, next) => {
  // res.send('login user');
  const { email, password } = req.body;
  // console.log(password)
  if (!email || !password) {
    return next(createCustomError('Please provide email and password'));
  }
  const user = await User.findOne({ email });
  // console.log("===============================");
  // console.log(user.password);
  if (!user) {
    return next(createCustomError('Please provide email and password'));
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    return next(createCustomError('Invalid Credentials'));
  }
  // // compare password
  const token = createJWT(user);
  res.status(200).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
