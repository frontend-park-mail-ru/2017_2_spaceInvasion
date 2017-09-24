#!/usr/bin/env node

var express = require('express');
var path = require('path');
var app = express();

var port = process.env.PORT || 8080;
app.use('/', express.static(__dirname + '/public'));

var ejs = require('ejs');
var url = require('url');

ejs.delimiter = '?';
app.set('views', path.join(__dirname, '/public/templates'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/registration', function (req, res) {
    res.render('registration');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('*', function (req, res) {
    res.send('404');
});

app.listen(port);