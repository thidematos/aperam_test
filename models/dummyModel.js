const mongoose = require('mongoose');

const dummySchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Dummy from create-thigas!',
  },
});

dummySchema.pre('save', function (next) {
  //pre save middleware
  next();
});

dummySchema.pre(/^find/, function (next) {
  //Pre find middleware
  next();
});

const Dummy = mongoose.model('Dummy', dummySchema);

module.exports = Dummy;
