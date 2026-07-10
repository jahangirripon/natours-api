const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.param.id);
    if (!doc) {
      return new AppError('Not found!');
    }
    res.status(200).json({
      data: {
        doc: doc,
      },
    });
  });
