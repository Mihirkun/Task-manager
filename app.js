const express = require('express');
const app = express();
const task = require('./routes/task');
const connectDB = require('./db/connect');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

//middleware
app.use(express.static('./public'));
app.use(express.json());

//routes

// app.get('/', (req, res) => {
//   res.send('hello');
// });
app.use('/api/v1/tasks', task);
app.use(notFound);
app.use(errorHandler);
const port = process.env.port || 8080;

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
