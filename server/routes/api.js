const express = require ('express');
const router = express.Router();
const Tasks = require('../models/tasks');

router.get('/tasks', (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Tasks.find({}, 'action')
    .then(data => res.json(data))
    .catch(next)
});

router.post('/tasks', (req, res, next) => {
  if (req.body.action) {
    Tasks.create(req.body)
      .then(data => res.json(data))
      .catch(next)
  } else {
    res.status(400).json({
      error: "The 'action' field is empty"
    })
  }
});

router.delete('/tasks/:id', (req, res, next) => {
  Tasks.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router;