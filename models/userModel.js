const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name, email, photo, password, passwordconfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'Must max 40 chars'],
    minlength: [10, 'Must min 10 chars'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a mail'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'This should be an email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A user must have a mail'],
    minlength: [10, 'Must min 10 chars'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a mail'],
    minlength: [10, 'Must min 10 chars'],
    select: false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not same ',
    },
  },
  photo: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  // next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    console.log(changedTimestamp, JWTTimestamp);

    return JWTTimestamp > changedTimestamp;
  }

  // false means pass not changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
