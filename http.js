const http = require('http');
const fs = require("fs");

const port = 3000;

http.createServer((req, res) => {
    const url = req.url === '/' ? '/main.html' : req.url;

    fs.readFile('./public' + url, (err, data) => {
        if (!err) {
            res.end(data);
        }
    });

}).listen(port);