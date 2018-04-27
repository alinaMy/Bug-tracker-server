const express = require('express');
const Task = require('../models/task');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res, next) => {
  Task.find()
    .select("_id title description status")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        product: docs.map(doc =>{
          return{
            title: doc.title,
            description: doc.description,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/tasks/' + doc._id
            }
          }
        })
      };
      //  if(docs.length >= 0) {
          res.status(200).json(response);
        // }else{
        //   res.status(404).json({
        //     message: "No entries were found"
        //   });
        // }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
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
      res.status(201).json({
        messaage: 'Task created successfully',
        createdTask: {
          title: result.title,
          description: result.description,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/tasks/' + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

});

router.get('/:taskId', (req, res, next) => {
  const id = req.params.taskId;
  Task.findById(id)
    .exec()
    .then(doc => {
      console.log("From database: ", doc);
      if(doc){
        res.status(200).json(doc);
      }else{
        res.status(404).json({
          message: "No valid entery was found for provided ID"
        })
      }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err})
    });
});

router.delete('/:taskId', (req, res, next) => {
  const id = req.params.taskId;
  Task.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted"
      });
      })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

});

router.patch('/:taskId', (req, res, next) => {
  const id = req.params.taskId;
  const updateOps = {};
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Task.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Task updated"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;

