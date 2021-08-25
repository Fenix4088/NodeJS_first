const express = require('express');
const cors = require('cors');
const users = require('./controllers/users-router.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 7542;
const HOSTNAME = '127.0.0.1';
const PASSWORD = 'incubator';
const DBPATH = `mongodb+srv://incubator:${PASSWORD}@cluster0.0av7w.mongodb.net/incubator?retryWrites=true&w=majority`;

process.on('unhandledRejection', function (reason, p) {
  console.log('Unhandled', reason, p); // log all your errors, "unsuppressing" them.
  throw reason; // optional, in case you want to treat these as errors
});

mongoose.connect(DBPATH, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected!");
});

app.use(cors());
app.use(bodyParser.json());
app.use('/users', users);

app.get('/tasks', async (req, res) => {
  res.send('Tasks');
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

