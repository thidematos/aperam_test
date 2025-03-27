const mongoose = require('mongoose');

module.exports = async () => {
  const string = process.env.DB_CONNECTION.replace(
    '<password>',
    process.env.DB_PASSWORD
  );

  await mongoose.connect(string);

  console.log('Mongo connected! 🦊');
};
