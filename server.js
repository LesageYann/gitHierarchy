var express = require('express');
var app = express();

require("./lib/githubRequest/router.js").init(express,app);

app.listen(3000, function () {
    console.log('Server run on port 3000');
});
