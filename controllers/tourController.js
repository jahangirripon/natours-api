const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);
    // // FILTERING
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'limit', 'sort', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    // // ADVANCED FILTERING
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b{gte|gt|lte|lt}\b/g, (match) => `$${match}`);
    // // console.log(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));
    // // console.log(req.query);
    // // GET /api/v1/tours?duration[lte]=4 200 74.738 ms - 1809
    // // { price: { lte: '800' } }
    // // { price: { '$lte': '800' } }

    //SORT
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' '); //127.0.0.1:3000/api/v1/tours?sort=price,ratingsAverage
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }
    // ascending and descending
    // 127.0.0.1:3000/api/v1/tours?sort=-price

    // 3. field limiting (127.0.0.1:3000/api/v1/tours?fields=name, price, duration)
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // 4. PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error("This page doesn't exist.");
    // }

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    //const tours = await query;

    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      data: {
        tour: tour,
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

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      data: {
        tour: tour,
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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          avgRating: { $avg: '$ratingsAverage' },
          numOfRatings: { $sum: '$ratingsQuantity' },
          numOfTours: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);

    res.status(200).json({
      data: {
        status: 'success!',
        stats,
      },
    });
  } catch (error) {
    res.status(404).json({
      data: {
        status: 'Fail!!!',
        message: error,
      },
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
    ]);

    res.status(200).json({
      data: {
        status: 'success!',
        plan,
      },
    });
  } catch (error) {
    res.status(404).json({
      data: {
        status: 'Fail!!!',
        message: error,
      },
    });
  }
};
