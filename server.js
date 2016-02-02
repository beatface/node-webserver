const express = require('express');
const app = express();

app.get('/hello', function (req, res) {
  res.send('Hello World!');
});

app.get('/random', (req, res) => {
	res.send(Math.random().toString());
});

app.get('*', function (req, res) {
  res.send('OTHER!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
