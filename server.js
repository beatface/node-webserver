const http = require('http');

http.createServer((req, res) => {
  console.log(req.method, req.url);
}).listen(3000, () => {
  console.log("Node.js server started. Listening on port 3000");
});
