const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  const tours = await Tour.find();
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
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
