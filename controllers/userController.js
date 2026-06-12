const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// const fs = require('fs');
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`),
// );

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users: users,
    },
  });
});

exports.getUser = (req, res) => {
  // console.log(req.params);
  console.log(req.requestTime);

  const user_id = req.params.id * 1;
  if (user_id > users.length) {
    const user = users.find((el) => el.id === user_id);
    res.status(404).json({
      data: {
        requestTime: req.requestTime,
        user: 'No user found!',
        params: req.params,
        body: req.body,
      },
    });
  } else {
    const user = users.find((el) => el.id === user_id);
    res.status(200).json({
      data: {
        user,
      },
    });
  }
};

exports.createUser = (req, res) => {
  // console.log(req.body); // raw -> json; MW => app.use(express.json());
  // console.log(res);

  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  users.push(newUser);
  fs.writeFile(
    `${__dirname}/dev-data/data/users-simple.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      });
    },
  );
  // res.send('Done');
};

exports.updateUser = (req, res) => {
  const user_id = req.params.id * 1;
  if (user_id > users.length) {
    const user = users.find((el) => el.id === user_id);
    res.status(404).json({
      data: {
        user: 'No user found!',
      },
    });
  } else {
    const user = users.find((el) => el.id === user_id);
    res.status(200).json({
      data: {
        user: 'Updated!',
      },
    });
  }
};

exports.deleteUser = (req, res) => {
  const user_id = req.params.id * 1;
  if (user_id > users.length) {
    const user = users.find((el) => el.id === user_id);
    res.status(404).json({
      data: {
        user: 'No user found!',
      },
    });
  } else {
    const user = users.find((el) => el.id === user_id);
    res.status(204).json({
      data: {
        user: null,
      },
    });
  }
};
