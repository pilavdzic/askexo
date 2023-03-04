const express = require('../../../home/korby/node_modules/express');
require('../../../home/korby/node_modules/dotenv').config({ path: './env/.env' });

const apiKey = process.env.API_KEY;
var app = express();

console.log(apiKey)

//app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
});

app.post('/button1', (req, res) => {
  res.send('Button 1 was clicked');
});

app.post('/button2', (req, res) => {
  res.send('Button 2 was clicked');
});

app.listen(process.env.PORT || 3000)