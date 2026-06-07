const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
//name, email, photo, password, passwordconfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'Must max 40 chars'],
    minlength: [10, 'Must min 10 chars'],
    // validate: [
    //   validator.isAlpha,
    //   'User name must only contain chars and no spaces',
    // ],
  },
  email: {
    type: String,
    required: [true, 'A user must have a mail'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'This should be an email'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a mail'],
    minlength: [10, 'Must min 10 chars'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a mail'],
    minlength: [10, 'Must min 10 chars'],
  },
  photo: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//document MW runs before .save() and .create()
userSchema.pre('save', async function () {
  this.slug = slugify(this.name, { lower: true });
  // next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
