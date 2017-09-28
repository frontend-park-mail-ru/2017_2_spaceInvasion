#!/usr/bin/env node

const express = require('express');
const path = require('path');

const app = express();
const cors = require('cors');
const body = require('body-parser');
const cookie = require('cookie-parser');
const uuid = require('uuid/v4');
require('morgan');
require('url');

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(body.json());
app.use(cookie());

const port = process.env.PORT || 8080;
app.use('/', express.static(`${__dirname}/public`));

app.set('views', path.join(__dirname, '/public/templates'));
app.engine('html', require('pug').renderFile);

app.set('view engine', 'pug');

const users = {};
const ids = {};

app.post('/auth', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).end();
  }
  if (!users[email]) {
    users[email] = {
      username,
      email,
      password,
    };
  }
  const id = uuid();
  ids[id] = email;
  res.cookie('JSESSIONID', id, { expires: new Date(Date.now() + (1000 * 60 * 10)) });
  res.json({ id });
  return res.status(200).end();
});

app.get('/', (req, res) => {
  res.render('index.pug');
});

app.get('*', (req, res) => {
  res.send('404');
});

app.listen(port);
