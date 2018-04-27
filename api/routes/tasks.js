const express = require('express');
const Task = require('../models/task');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    mesaage: 'Handling Get request to /tasks'
  });
});

router.post('/', (req, res, next) => {
  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    status: req.body.status
  });
  task
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err));
  res.status(201).json({
    mesaage: 'Handling Post request to /tasks',
    createdTask: task
  });
});

router.get('/:taskId', (req, res, next) => {
  const id = req.params.taskId;
  Task.findById(id)
    .exec()
    .then(doc => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err})
    });
});

router.delete('/', (req, res, next) => {
  res.status(200).json({
    mesaage: 'Deleted product!'
  });
});

router.patch('/', (req, res, next) => {
  res.status(200).json({
    mesaage: 'Updated product!'
  });
});

module.exports = router;

