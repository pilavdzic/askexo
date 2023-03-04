
//UPDATE this in ecosystem.config file

console.log('here is the path from process.env.NODE_MODULES_PATH:')
console.log(process.env.NODE_MODULES_PATH)

const nodeModulesPath = process.env.NODE_MODULES_PATH || 'C:/Users/mattc/node_modules';
const express = require(`${nodeModulesPath}/express`);

const apiKey = process.env.API_KEY || require('./env/env.js')
var app = express();

//app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
});

app.post('/button1', (req, res) => {
  res.send('Button 1 was clicked' + apiKey);
});

app.post('/button2', (req, res) => {
  res.send('Button 2 was clicked');
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is listening on port ${process.env.PORT || 3000}`);
})