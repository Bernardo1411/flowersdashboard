require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5001;
// const { DB_USER } = process.env;
// const { DB_PASSWORD } = process.env;

app.use(cors());

const uri = 'mongodb+srv://bernardo1411:qgwUqBa3mllUZITv@flowers.8rnkndy.mongodb.net/?retryWrites=true&w=majority';

const usersRoutes = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(usersRoutes);

mongoose.set('strictQuery', false);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(port);
});
