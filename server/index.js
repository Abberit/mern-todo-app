const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/api");
const path = require("path");

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
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

// allow incoming requests from UX running on different port in dev setup
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/api", routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGTERM", function () {
  console.log(`Received SIGTERM, gracefully closing httpServer`);
  server.close(function () {
    console.log(`Http server ready to shutdown`);
    process.exit(0);
  });
});
