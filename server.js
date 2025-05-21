process.on('uncaughtException', (err) => {
  console.log('Exception!');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const dotenv = require('dotenv');
const connectionDB = require('./utils/connectDB');
const schedule = require('node-schedule');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const cronVerifyEmails = require('./utils/cronVerifyEmails');

dotenv.config({ path: `${__dirname}/config.env` });

process.env.GOOGLE_APPLICATION_CREDENTIALS;

const server = app.listen(process.env.PORT || 3000, async () => {
  console.log('Server started!');

  initializeApp({
    credential: applicationDefault(),
  });
  await connectionDB();
});

/* const job = schedule.scheduleJob(
  '* * * * *',
  cronVerifyEmails.sendEmails.bind(cronVerifyEmails)
); */

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
