// Main file
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const router = require('./router');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router(app);

// App Setup
app.use(morgan('combined'));


// Server Setup
const DB = process.env.MONGOSTRING.replace('<password>', process.env.MONGOPW)
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
.then(() => {
  console.clear();
  console.log("DB Connected! ===============================");
  app.listen(process.env.PORT || 5000, function () {
    console.log("Listening on port " + process.env.PORT);
  });
});