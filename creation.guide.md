# Creation guide
This guide can be used as tutorial on how to create MERN application on Linode. You may use code in `./server` and `./client` for the reference on end result.

# Prerequisites
* Node.js and yarn installed.
* MongoDB database installed.

# Create MERN app from scratch

1. Create new folder to be the root of your new Node.js application.

2. Create two folders `./server` and `./client`, which will hold backend and frontend.

## Building backend

1. Enter folder `./server`.

2. Run ```yarn init``` and follow prompts from command line:
```bash
yarn init
```

3. Add production depenendency on Express Node.js framework:
```bash
yarn add -E express
```

4. Add file `./server/index.js` with the content for minimal Express server:

```javascript
const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
  res.send("Welcome to Express");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

5. Run the server and check it is working:
```bash
node index.js
```

6. Add production dependency on MongoDB client and modelling utility:
```bash
yarn add -E mongoose
```

6. Add file `./server/models/tasks.js` with the content:
```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema for tasks
const TasksSchema = new Schema({
  action: {
    type: String,
    required: [true, "The action text field is required"],
  },
  completed: {
    type: Boolean,
    required: [false],
  },
});

//create model for tasks
const Tasks = mongoose.model("tasks", TasksSchema);

module.exports = Tasks;
```

7. Add file `./routes/api.js` with the content:

```javascript
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
```

8. Add production dependency on Express middleware:
```bash
yarn add -E body-parser
```

9. Update the content of `./server/index.js` with:
```javascript
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/api");

const app = express();
const port = process.env.PORT || 5000;
const mongoDBConnectionString = process.env.MONGODB;

if (!mongoDBConnectionString) {
  console.error(`Not found connection string in "MONGODB" environment variable, exiting.`);
  process.exit(1);
}

//connect to the database
mongoose
  .connect(mongoDBConnectionString, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

10. Add development dependency to setup environment variables:
```bash
yarn add -D -E dotenv
```

11. Create file `./server/.env` which defines environment variable `MongoDB` holding connection string to your MongoDB:
```
MONGODB=REPLACE_WITH_YOUR_CONNECTION_STRING
```

12. Run server again and check your server works as expected (`-r dotenv/config` is needed to set environment variables):
```bash
node -r dotenv/config index.js
```

13. Test your API server. If you use VSCode you may test API using extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) and file `./test.http` with following content:
```
##
## This is test file which can be executed with REST Client VSCode extension:
## https://marketplace.visualstudio.com/items?itemName=humao.rest-client
##

### Get tasks
GET http://localhost:5000/api/tasks HTTP/1.1

#### Add task
# @name newTask
POST http://localhost:5000/api/tasks HTTP/1.1
content-type: application/json

{
  "action": "Test API of my MERN TODO application",
  "completed": false
}

### Get tasks to see new task returned
GET http://localhost:5000/api/tasks HTTP/1.1

#### Update task
PUT http://localhost:5000/api/tasks/{{id}} HTTP/1.1
content-type: application/json

{
  "completed": true
}

### Get tasks to see new task updated
GET http://localhost:5000/api/tasks HTTP/1.1

### Delete new task
@id = {{newTask.response.body.$._id}}
DELETE http://localhost:5000/api/tasks/{{id}} HTTP/1.1
```


14. Now let's create React frontend: go to project root and run `yarn create react-app client`.