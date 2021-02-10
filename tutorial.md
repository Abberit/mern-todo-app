# Tutorial

This tutorial demonstrates how to create MERN (MongoDB, Express, React, Node.js) application on Linode. You may use code in `./server` and `./client` for the reference on end result.

At the end of tutorial you will have TODO web application hosted on Linode server alongside with MongoDB and Node backend.

## Prerequisites

* Node.js (14+) and yarn (1.22+) installed on local dev machine.
* MongoDB (4.4.3+) database installed on local dev machine or elsewhere.
* Account on Linode to deploy once local app is ready.

## Option 1: Run existing MERN app

1. In case if you don't want to create the app from scratch, then clone the repo:

```bash
  git clone https://github.com/Abberit/mern-todo-app.git
```

2. Run build at the root of the project:
```bash
  cd mern-todo-app
  yarn build
```

3. Create file `./server/.env` which defines environment variable `MongoDB` holding connection string to your MongoDB:
```
MONGODB=REPLACE_WITH_YOUR_CONNECTION_STRING
```

3. Start application and verify it is working:
```bash
  yarn start
```

## Option 2: Create MERN app from scratch

To learn the stack better - we highly recommend to create your application from scratch. To do that: follow [these steps](tutorial.mern.from.scratch.md).

## Deploy on Linode server

1. Deploy Abberit Admin Panel with default Node.js app using [Linode Node.js StackScript](https://cloud.linode.com/stackscripts/745522). You will see something like this, when you navigate to Abberit Admin Panel:
![nodejs app list](/img/nodejs-app-list.png)

2. Deploy MongoDB using Abberit Admin Panel and name it `tasks`: [Deploy MongoDB on Linode](https://abberit.io/docs/app-add-mongodb/)

3. Configure Node.js `defaultApp` to use MongoDB `tasks`: navigate to `App Settings` of `defaultApp` and create a new setting `MONGODB` holding connection string. For MongoDB `tasks` private connection string would be `mongodb://tasks:27017`. More on settings management you can read [here](https://abberit.io/docs/app-manage-nodejs/#app-settings).

4. Deploy TODO app we just created by navigating to `File Browser` of `defaultApp` and dragging the content of `server` folder of our app to `File Browser` content:
![TODO app deployment](/img/nodejs-deploy-file-browser.png)

5. Navigate to `Logs` tabs of `defaultApp` and click `Restart app` icon in top right corner:
![restart with logs](/img/nodejs-logs-restart.png)

6. Your application should be running on Linode server now! To navigate to it - click on `Hosting Environment` tab and click on `App uri`:
![nodejs app uri](/img/nodejs-app-uri.png)

7. Enjoy! You just created safe deployment of modern TODO MERN application on one of the best hosting provider.

8. If you would like to learn the solution better: you have a little challenge. Currently there is no way to edit the task with our TODO app. Get that done and get it deployed on Linode again.

P.S. If you liked this tutorial, run into some troubles or have a request on what other tutorial might help you - please don't hesitate to reach out at info@abberit.io.
