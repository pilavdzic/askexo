const nodeModulesPath = '/../../../home/korby/node_modules/';//process.env.NODE_MODULES_PATH || 'C:/Users/mattc/node_modules';
//const nodeModulesPath = 'C:/Users/mattc/node_modules';
const express = require(`${nodeModulesPath}/express`);
const bodyParser = require(`${nodeModulesPath}/body-parser`)
const winston = require(`${nodeModulesPath}/winston`);
const { Configuration, OpenAIApi } = require(`${nodeModulesPath}/openai`);

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

const configuration = new Configuration({
  apiKey: apiKey
});

const openai = new OpenAIApi(configuration);

var getResponse = async function(prompt){
  
  const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: prompt,
  max_tokens: 100,
  temperature: 0
  });

  console.log(response.data.choices[0].text)

  return response.data.choices[0].text

}

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // this is used for parsing the JSON object from POST

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} ${res.statusCode}`);
  next();
});

//app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
});

app.post('/btnSubmit', async (req, res) => {
  var query = req.body.query;
  console.log(query)
  var response = await getResponse(query)
  res.send(response);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is listening on port ${process.env.PORT || 3000}`);
})