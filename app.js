const nodeModulesPath = process.env.NODE_MODULES_PATH || 'C:/Users/mattc/node_modules';
const express = require(`${nodeModulesPath}/express`);
const winston = require(`${nodeModulesPath}/winston`);

const apiKey = process.env.API_KEY || require('./env/env.js')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'myapp' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console()
  ]
});

logger.info('node modules path is...' + nodeModulesPath);

var app = express();

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} ${res.statusCode}`);
  next();
});

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