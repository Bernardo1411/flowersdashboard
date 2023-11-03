require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const port = 5001;
const { DB_USER } = process.env;
const { DB_PASSWORD } = process.env;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.5qzjn.mongodb.net/appEquinos?retryWrites=true&w=majority`;

const institutionRoutes = require('./routes/institution');
const vetRoutes = require('./routes/vet');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  let userToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const [...token] = req.headers.authorization.split(' ')[1];
    userToken = token.toString().replaceAll(',', '');

    return jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
      if (!decoded) return res.status(400).json({ isAuth: decoded });

      return res.status(200).json({ isAuth: true });
    });
  }
  return res.status(400).json({ error: 'Requisição inválida' });
});

app.use(institutionRoutes);
app.use(vetRoutes);

mongoose.set('strictQuery', false);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(port);
});
