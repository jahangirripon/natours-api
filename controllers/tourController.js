const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b{gte|gt|lte|lt}\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    const query = Tour.find(JSON.parse(queryStr));
    const tours = await query;
    // console.log(req.query);
    // GET /api/v1/tours?duration[lte]=3 200 74.976 ms - 930
    // { duration: { lte: '4' } }
    // { duration: { '$lte': '4' } }
    // GET /api/v1/tours?duration[lte]=4 200 74.738 ms - 1809
    // { price: { lte: '800' } }
    // { price: { '$lte': '800' } }

    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error,
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
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
