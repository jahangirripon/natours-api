const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../models/tourModel');

mongoose
  .connect(
    'mongodb+srv://connectericj_db_user:pgA7RrL746IlzGt7@cluster0.larpuhs.mongodb.net/natours?appName=Cluster0',
  )
  .then((con) => {
    // console.log(con.connections);
  });

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync('./data/tours.json', 'utf-8'));

//IMPORT DATA TO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data loaded');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// DELETE ALL DATA FROM COLLECTIONS
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
// kpax@DESKTOP-H4NRTIT MINGW64 /d/laragon/www/repl/node/express/dev-data
// cd into dev-data
// node import-data.js --delete
// node import-data.js --import
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
