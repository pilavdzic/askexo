const nodeModulesPath = require('./modules/getNodeModulesPath')
const express = require(`${nodeModulesPath}/express`);
const bodyParser = require(`${nodeModulesPath}/body-parser`)
const getQueryEmbedding = require('./modules/getQueryEmbedding').getQueryEmbedding
const getOpenAiResponse = require('./modules/getOpenAiResponse')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // this is used for parsing the JSON object from POST

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
});

app.post('/btnSubmit', async (req, res) => {
  const query = req.body.query;
  const emb = getQueryEmbedding('hello');
  console.log(emb)
  const response = await getOpenAiResponse(query)
  res.send(response);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is listening on port ${process.env.PORT || 3000}`);
})