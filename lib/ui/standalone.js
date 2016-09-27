var express = require('../../node_modules/express');
var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  res.header("X-Content-Type-Options",'nosniff');
  res.header("X-XSS-Protection",'1; mode=block');
  res.header("X-Frame-Options",'SAMEORIGIN');
  next();
});

app.get('/', function(req, res){
  res.sendFile(__dirname +'/index.html');
});

app.use('/public',express.static('public'));

app.listen(3000);
