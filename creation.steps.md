# Prerequisites:
* Node.js and yarn installed.
* MongoDB database installed.

# How this repo was created:

1. Run ```yarn init``` and follow prompts from command line.

2. Run ```yarn add -E express``` to add production depenendency on Express Node.js framework.

3. Add file `./index.js` with the content for minimal Express server:

```javascript
const express = require('express');
//require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
  res.send('Welcome to Express');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

4. Run the server with ```node index.js``` and check it is working.

5. Run ```yarn add -E mongoose``` to add production dependency on MongoDB client and modelling utility.

6. Add file './models/tasks.js' with the content:

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for tasks
const TasksSchema = new Schema({
  action: {
    type: String,
    required: [true, 'The action text field is required'],
  }
})

//create model for tasks
const Tasks = mongoose.model('tasks', TasksSchema);

module.exports = Tasks;
```

7. Add file `./routes/api.js` with the content:

```javascript
const express = require ('express');
const router = express.Router();
const Tasks = require('../models/tasks');

router.get('/todos', (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Tasks.find({}, 'action')
    .then(data => res.json(data))
    .catch(next);
});

router.post('/todos', (req, res, next) => {
  if (req.body.action) {
    Tasks.create(req.body)
      .then(data => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: "The input field is empty"
    });
  }
});

router.delete('/todos/:id', (req, res, next) => {
  Tasks.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
});

module.exports = router;
```

8. Run `yarn add -E body-parser` to add production dependency on Express middleware.

9. Update the content of `./index.js` with this content:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/api');

const app = express();
const port = process.env.PORT || 5000;
const mongoDBConnectionString = process.env.MONGODB;

if (!mongoDBConnectionString) {
  console.error('Not found connection string in "MONGODB" environment variable, exiting.');
  process.exit(1);
}

//connect to the database
mongoose.connect(mongoDBConnectionString, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(err));

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
```

10. Run ```yarn add -D -E dotenv``` to add development dependency to setup environment variables.

11. Create file `./.env` which defines environment variable `MongoDB` holding connection string to your MongoDB:
```
MONGODB=REPLACE_WITH_YOUR_CONNECTION_STRING
```

12. Run server again with the command `node -r dotenv/config index.js` and check your server works as expected.

13. Test your API server. If you use VSCode you may test API using extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) and file `./test.http` with following content:
```
### Get tasks
GET http://localhost:5000/api/tasks HTTP/1.1

#### Add task
# @name newTask
POST http://localhost:5000/api/tasks HTTP/1.1
content-type: application/json

{
  "action": "Test API of my MERN TODO application"  
}

### Get tasks to see new task returned
GET http://localhost:5000/api/tasks HTTP/1.1

### Delete new task
@id = {{newTask.response.body.$._id}}
DELETE http://localhost:5000/api/tasks/{{id}} HTTP/1.1
```

14. Now let's create React frontend: go to project root and run `yarn create react-app client`.