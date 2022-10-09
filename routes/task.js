const express = require('express');
const router = express.Router();
const controller = require('../Controller/tasks');

router.route('/').get(controller.getAllTasks);
router.route('/').post(controller.createTask);
router.route('/:id').get(controller.getTask);
router.route('/:id').patch(controller.updateTask);
router.route('/:id').delete(controller.deleteTask);
module.exports = router;
