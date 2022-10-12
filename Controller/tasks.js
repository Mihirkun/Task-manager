const Task = require('../model/Task');
const asyncWrapper = require('../middleware/async');
const createCustomError = require('../errors/custom-error').createCustomError;

const getAllTasks = asyncWrapper(async (req, res) => {
  const { name, sort, numericFilters } = req.query;

  const queryObject = {};
  if (name) {
    queryObject.name = name;
  }
  if (numericFilters) {
    console.log(numericFilters);
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  let result = Task.find(queryObject);
  if (sort) {
    const sortList = sort.split(',').join(' ');

    result = result.sort(sortList);
  }
  const tasks = await result;
  // console.log(result);
  res.status(200).json({ tasks });
});

const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
}

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }

  res.status(200).json({ task });
});
const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }
  res.status(200).json({ task });
});
const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;

  const task = await Task.findByIdAndUpdate(taskID, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }

  res.status(200).json({ task });
});
module.exports = {
  getTask,
  updateTask,
  deleteTask,
  createTask,
  getAllTasks,
};
