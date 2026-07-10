const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// exports.getAllReviews = async (req, res) => {
//   try {
//     // EXECUTE QUERY
//     // const features = new APIFeatures(Review.find(), req.query)
//     //   .filter()
//     //   .sort()
//     //   .limitFields()
//     //   .paginate();
//     // const reviews = await features.query;
//     //const tours = await query;
//     let filter = {};
//     if (req.param.tourId) filter = { tour: req.params.tourId };
//     const reviews = await Review.find(filter);

//     res.status(200).json({
//       status: 'success',
//       result: reviews.length,
//       data: {
//         reviews: reviews,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err.message,
//     });
//   }
// };

exports.getAllReviews = catchAsync(async (req, res) => {
  let filter;
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews: reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No Review Found!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review: review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      data: {
        review: review,
      },
    });
  } catch (error) {
    res.status(404).json({
      data: {
        status: 'Fail!',
        message: error,
      },
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await review.findByIdAndDelete(req.params.id);
    res.status(200).json({
      data: {
        review: review,
      },
    });
  } catch (error) {
    res.status(404).json({
      data: {
        status: 'Fail!',
        message: error,
      },
    });
  }
};
