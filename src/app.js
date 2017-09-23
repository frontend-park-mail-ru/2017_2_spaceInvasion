#!/usr/bin/env node

var express = require('express');
var path = require('path');
var app = express();
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');

app.use(body.json());
app.use(cookie());

var port = process.env.PORT || 8080;
app.use('/', express.static(__dirname + '/public'));

var url = require('url');

app.set('views', path.join(__dirname, '/public/templates'));
app.engine('html', require('pug').renderFile);
app.set('view engine', 'pug');

const users = {};
const ids = {};

app.post('/auth', function (req, res) {
	console.log("pooost");
	const username = req.body.login;
	const email = req.body.email;
	const password = req.body.password;
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
	console.log(users[email]);
	const id = uuid();
	ids[id] = email;

	res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.json({id});
});


app.get('/', function (req, res) {
    res.render('index.pug');
});

app.get('*', function (req, res) {
    res.send('404');
});

app.listen(port);
