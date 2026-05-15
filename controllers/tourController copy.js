const fs = require('fs');
const Tour = require('../models/tourModel');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

exports.checkID = (req, res, next, val) => {
  // console.log(req.params);
  // console.log(req.requestTime);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.duration) {
    return res.status(404).json({
      status: 'fail',
      message: 'Name and duration params missing',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  const tour_id = req.params.id * 1;
  const tour = tours.find((el) => el.id === tour_id);
  res.status(200).json({
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body); // raw -> json; MW => app.use(express.json());
  // console.log(res);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
  // res.send('Done');
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    data: {
      tour: 'Updated!',
    },
  });
};

exports.deleteTour = (req, res) => {
  const tour_id = req.params.id * 1;
  const tour = tours.find((el) => el.id === tour_id);
  res.status(204).json({
    data: {
      tour: null,
    },
  });
};

// exports.getTour = (req, res) => {
//   // console.log(req.params);
//   console.log(req.requestTime);

//   const tour_id = req.params.id * 1;
//   if (tour_id > tours.length) {
//     const tour = tours.find((el) => el.id === tour_id);
//     res.status(404).json({
//       data: {
//         requestTime: req.requestTime,
//         tour: 'No tour found!',
//         params: req.params,
//         body: req.body,
//       },
//     });
//   } else {
//     const tour = tours.find((el) => el.id === tour_id);
//     res.status(200).json({
//       data: {
//         tour,
//       },
//     });
//   }
// };
