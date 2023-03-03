const express = require('../../../home/korby/node_modules/express');
var app = express();

//app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
});

app.post('/button1', (req, res) => {
  console.log('Button 1 was clicked');
  res.send('Button 1 was clicked');
});

app.post('/button2', (req, res) => {
  console.log('Button 2 was clicked');
  res.send('Button 2 was clicked');
});

app.listen(process.env.PORT || 3000)