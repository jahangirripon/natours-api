/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

console.log(process.env.DATABASE);

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.log(err);
  });

// dotenv.config({ path: './config.env' });
// dotenv.config({ path: './config.end' });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
