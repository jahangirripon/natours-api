/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

console.log(process.env.DATABASE);

mongoose
  .connect(
    'mongodb+srv://connectericj_db_user:pgA7RrL746IlzGt7@cluster0.larpuhs.mongodb.net/natours?appName=Cluster0',
  )
  .then((con) => {
    // console.log(con.connections);
    console.log('Connected!');
  });

dotenv.config({ path: './config.env' });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
