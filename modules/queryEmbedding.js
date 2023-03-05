
const COMPLETIONS_MODEL = 'text-davinci-003';
const MODEL_NAME = 'curie';
const DOC_EMBEDDINGS_MODEL = `text-search-${MODEL_NAME}-doc-001`;
const QUERY_EMBEDDINGS_MODEL = `text-search-${MODEL_NAME}-query-001`;
const openai = require('./openAiRequester');


/**
 * Get the embedding of a given text using the specified model.
 * @param {string} text - The text to embed.
 * @param {string} model - The name of the model to use.
 * @returns {List<float>} The embedding of the text.
 */
async function getEmbedding(text, model) {
  const result = await openai.createEmbedding({
    model: model,
    input: text,
  });
  const response = result.data.data[0].embedding;
  if (response.object === "error") {
	throw new Error(response.error.message);
  }
  return response;
}

/**
 * Get the query embedding of a given text using the default query embeddings model.
 * @param {string} text - The text to embed.
 * @returns {List<float>} The query embedding of the text.
 */
function getQueryEmbedding(text) {
  return getEmbedding(text, QUERY_EMBEDDINGS_MODEL);
}

module.exports = {getQueryEmbedding: getQueryEmbedding}
