const nodeModulesPath = require('./modules/nodeModulesPath')
const express = require(`${nodeModulesPath}/express`);
const bodyParser = require(`${nodeModulesPath}/body-parser`)
const getQueryEmbedding = require('./modules/queryEmbedding').getQueryEmbedding

const openai = require('./modules/openAiRequester');

const getResponse = async function(prompt){
  
  const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: prompt,
  max_tokens: 100,
  temperature: 0
  });
  return response.data.choices[0].text
}

const emb = getQueryEmbedding('hello');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // this is used for parsing the JSON object from POST

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
});

app.post('/btnSubmit', async (req, res) => {
  const query = req.body.query;
  const response = await getResponse(query)
  res.send(response);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is listening on port ${process.env.PORT || 3000}`);
})