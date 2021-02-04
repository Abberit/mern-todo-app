const express = require("express");
const router = express.Router();
const Tasks = require("../models/tasks");

router.get("/tasks", (req, res, next) => {
  Tasks.find({}, ["action", "completed"])
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/tasks", (req, res, next) => {
  if (req.body.action) {
    Tasks.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.status(400).json({
      error: "The 'action' field is empty",
    });
  }
});

router.put("/tasks/:id", (req, res, next) => {
  Tasks.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((data) => res.json(data))
    .catch(next);
});

router.delete("/tasks/:id", (req, res, next) => {
  Tasks.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

module.exports = router;
