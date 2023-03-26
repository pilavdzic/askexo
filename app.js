const nodeModulesPath = require('./modules/getCorrectFilePath').nodeModulesPath;
const express = require(`${nodeModulesPath}/express`);
const bodyParser = require(`${nodeModulesPath}/body-parser`)
const session = require(`${nodeModulesPath}/express-session`);
const NedbStore = require(`${nodeModulesPath}/nedb-session-store`)(session);
const path = require('path');

const getOpenAiResponse = require('./modules/getOpenAiResponse')
const queryBuilder = require('./modules/queryBuilder')
const csvReader = require('./modules/csvReader')
const getPreface = require('./modules/getConstants').getPreface;
const passDiagnostics = require('./modules/getConstants').getFrontEndDiagnostics
const app = express();

const store = new NedbStore({
  filename: path.join(__dirname,'db/sessions.db')
});

app.use(session({
  secret: 'a bird is my friend',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 30 * 60 * 1000 },//NEED TO SET TO TRUE?
  store: store
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.use((req, res, next) => {
  if (!req.session.userData) {
    req.session.userData = { messages: [{'role': 'user', 'content':  getPreface()}] };
  }
  next();
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/html/index.html')	
});

app.get('/faq', (req, res) => {
    res.sendFile(__dirname + '/html/faq.html')
});

app.post('/btnSubmit', async (req, res) => {
  const query = req.body.query;
  const data = await queryBuilder.getQuery(query);
  console.log(`1. the session contains ${req.session.userData.messages.length} messages`)
  req.session.userData.messages.push({'role': 'user', 'content':  data.text});
  console.log(`2. the session contains ${req.session.userData.messages.length} messages`)
  const messages = await queryBuilder.parseMessages(req.session.userData.messages);
  req.session.userData.messages = messages
  console.log(`3. the session contains ${req.session.userData.messages.length} messages`)
  const response = await getOpenAiResponse(req.session.userData.messages);
  req.session.userData.messages.push({'role': 'assistant', 'content': response});
  var frontendDiagnostics = '';
  if (passDiagnostics()) {
	frontendDiagnostics = await queryBuilder.getFrontendDiagnostics(req.session.userData.messages);
  }
  
  await csvReader.logQueryResponse(query, response, data.sources, data.tokens);
  console.log(`4. the session contains ${req.session.userData.messages.length} messages`)
  
  const jsonResponse = JSON.stringify({response: response, query: query, frontendDiagnostics: frontendDiagnostics});
  
  res.setHeader('Content-Type', 'application/json');
  
  res.send(jsonResponse);
  
});

const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is now listening on port ${process.env.PORT || 3000}`);
});

server.timeout = 300000;
