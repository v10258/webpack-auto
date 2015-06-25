var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
    var stream = fs.createReadStream(__dirname + '/package.json');

    stream.pipe(res);

}).listen(3000);
console.log('now we are listening 3000 port');