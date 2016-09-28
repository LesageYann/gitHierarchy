exports.init = function (express, app) {

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    res.header("X-Content-Type-Options", 'nosniff');
    res.header("X-XSS-Protection", '1; mode=block');
    res.header("X-Frame-Options", 'SAMEORIGIN');
    next();
  });

  console.log(__dirname)
  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  app.use('/public', express.static(__dirname+'/public'));
  
};