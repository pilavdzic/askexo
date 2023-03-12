const nodeModulesPath = require('./getCorrectFilePath').nodeModulesPath;
const openai = require('./getOpenAiRequester');
const Decimal = require(`${nodeModulesPath}/decimal.js`);

const MODEL_NAME = 'curie';
const QUERY_EMBEDDINGS_MODEL = `text-search-${MODEL_NAME}-query-001`;

async function getEmbedding(text, model) {
  const result = await openai.createEmbedding({
    model: model,
    input: text,
  });
  const response = result.data.data[0].embedding;
  if (response.object === "error") {
	throw new Error(response.error.message);
  }
  const decimalEmbeddings = response.map(value => new Decimal(value.toString(), 50));
  return decimalEmbeddings;
}

async function getQueryEmbedding(text) {
  try {
    const embeddings = await getEmbedding(text, QUERY_EMBEDDINGS_MODEL);
    return embeddings;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {getQueryEmbedding: getQueryEmbedding}
