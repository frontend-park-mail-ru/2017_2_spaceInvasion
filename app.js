var express = require('express');
var app = express();
const path = require('path');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public/templates"));
app.engine('html', require('pug').renderFile);
app.set('view engine', 'pug');
app.use('/', express.static(__dirname + '/public'));


app.get("/homepage", (req, res) => {
  res.render("homepage");
});



app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});