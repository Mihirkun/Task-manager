require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
const authRouter = require('./routes/auth');
const task = require('./routes/task');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

//middleware
app.use(express.static('./public'));
app.use(express.json());

//routes

// app.get('/api/v1/auth/register', (req, res) => {
//   res.send('hello');
// });
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', authenticateUser, task);

app.use(notFound);
// console.log("err")
// app.use(errorHandler);
const port = process.env.port || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`listening at ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();

