const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Must max 40 chars'],
      minlength: [10, 'Must min 10 chars'],
      // validate: [
      //   validator.isAlpha,
      //   'Tour name must only contain chars and no spaces',
      // ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty Must be easy, medium and difficult',
      },
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'ratingsAverage Must above 1'],
      max: [5, 'ratingsAverage Must below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'priceDiscount ({VALUE}) must less than price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image'],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//document MW runs before .save() and .create()
tourSchema.pre('save', async function () {
  this.slug = slugify(this.name, { lower: true });
  // next();
});

// query MW
tourSchema.pre('find', async function () {
  this.find({ secretTour: { $ne: true } });
});

// aggregation MW
tourSchema.pre('aggregate', async function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

// const testTour = new Tour({
//   name: 'Forest hiker2',
//   rating: 4.56,
//   price: 66.69,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((e) => {
//     console.log('Error', e);
//   });
