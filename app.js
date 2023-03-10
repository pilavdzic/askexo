const nodeModulesPath = require('./modules/getNodeModulesPath')
const express = require(`${nodeModulesPath}/express`);
const bodyParser = require(`${nodeModulesPath}/body-parser`)
const getOpenAiResponse = require('./modules/getOpenAiResponse')
const queryBuilder = require('./modules/queryBuilder')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
});

app.post('/btnSubmit', async (req, res) => {
  const query = req.body.query;
  const data = await queryBuilder(query);
  const response = await getOpenAiResponse(data);
  res.send(response);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is listening on port ${process.env.PORT || 3000}`);
})