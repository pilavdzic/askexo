const nodeModulesPath = require('./modules/getCorrectFilePath').nodeModulesPath;
const express = require(`${nodeModulesPath}/express`);
const bodyParser = require(`${nodeModulesPath}/body-parser`)
const getOpenAiResponse = require('./modules/getOpenAiResponse')
const path = require('path');
const queryBuilder = require('./modules/queryBuilder')
const csvReader = require('./modules/csvReader')

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
  const response = await getOpenAiResponse(data.text);
  console.log(response);
  await csvReader.logQueryResponse(query, response, data.sources, data.tokens);
  // Convert response object to JSON string
  const jsonResponse = JSON.stringify({response: response, query: query});
  
  // Set the response headers to indicate that the response is JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Send the JSON string as the response
  res.send(jsonResponse);
  
});

const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is now listening on port ${process.env.PORT || 3000}`);
});

server.timeout = 300000;
