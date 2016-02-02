const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  console.log(req.method, req.url);

  res.writeHead(PORT, {
    "content-type": "text/html"
  });

  if(req.url === "/hello") {
  	const msg = '<h1>Hello world!</h1>';

  	msg.split("").forEach((thing, i) => {
  		setTimeout(() => {
	  		res.write(thing)
		}, 500 * i);
  	});

  	setTimeout(()=> {
  		res.end('<h3>Bye world!</h3>');
  	}, 10000);
  } else if (req.url === "/random") {
  	res.end(Math.random().toString());
  } else {
  	res.writeHead(403);
  	res.end('Access denied');
  }


}).listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
