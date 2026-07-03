const mongoose = require('mongoose');

// review / rating / createdAt / tour / user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      minlength: [10, 'Must min 2 chars'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user'],
      },
    ],
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour'],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, async function () {
  this.populate({
    path: 'tour',
    select: 'name',
  });
});

reviewSchema.pre(/^find/, async function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
