const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [8, 'A Password should have more than 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: true,
    select: false,
    minlength: [8, 'A password confirm should be longer than 8 characters'],
    validate: {
      validator: function (field) {
        return field === this.password;
      },
      message: 'Passwords should match',
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },

  passwordResetToken: String,
  passwordResetExpiration: String,
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password' || this.isNew)) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.getPasswordResetToken = function () {
  let token = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.passwordResetExpiration = Date.now() + 10 * 60 * 1000;

  return token;
};

userSchema.methods.correctPassword = async function (
  reqPassword,
  userPassword
) {
  return await bcrypt.compare(reqPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimeStamp < changedTimeStamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
