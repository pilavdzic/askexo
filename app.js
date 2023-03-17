const nodeModulesPath = require('./modules/getCorrectFilePath').nodeModulesPath;
const express = require(`${nodeModulesPath}/express`);
const bodyParser = require(`${nodeModulesPath}/body-parser`)
const getOpenAiResponse = require('./modules/getOpenAiResponse')
const path = require('path');
const queryBuilder = require('./modules/queryBuilder')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/html/index.html')
});

app.get('/faq', (req, res) => {
    res.sendFile(__dirname + '/html/faq.html')
});

app.post('/btnSubmit', async (req, res) => {
  console.log('request received...');
  const query = req.body.query;
  const data = await queryBuilder(query);
  const response = await getOpenAiResponse(data);
  console.log(response);
  res.send(response);
});

const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is now listening on port ${process.env.PORT || 3000}`);
});

server.timeout = 300000;
