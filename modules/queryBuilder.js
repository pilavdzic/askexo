const nodeModulesPath = require('./getCorrectFilePath').nodeModulesPath;
const {encode, decode} = require(`${nodeModulesPath}/gpt-3-encoder`)
const csvReader = require('./csvReader')
const getRankedEmbeddings = require('./getRankedEmbeddings');
const getConstants = require('./getConstants');

const maxTextTokens = getConstants.maxTextTokens();
const tokenCeiling = getConstants.tokenCeiling();
const responseLength = getConstants.responseLength();
const textFile = 'all_sources.csv';

async function numTokensFromMessages(messages, model = getConstants.getModel()) {
  if (model === "gpt-3.5-turbo-0301") {
    let num_tokens = 0;
    for (const message of messages) {
      num_tokens += 4;
      for (const [key, value] of Object.entries(message)) {
        num_tokens += encode(value).length;
        if (key === "name") {
          num_tokens += -1;
        }
      }
    }
    num_tokens += 2;
    return num_tokens;
  } else {
    throw new Error(`num_tokens_from_messages() is not presently implemented for model ${model}. See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.`);
  }
}

function sortTexts(a, b){
	return a[1].localeCompare(b[1]);
}

//hash which is the key has to be in 1-index of the text array
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid][1] === target) {
      return arr[mid];
    } else if (arr[mid][1] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

async function getTopRankedTexts(query){
	var output = {text: '', sources: [], tokens: 0};
	try{
		const textArray = await csvReader.getDataArray(textFile);		
		const sortedSimilarityArray = await getRankedEmbeddings(query);
		var textTokens = 0;
		for (var i = 0; i < sortedSimilarityArray.length; i++){
			const textData = binarySearch(textArray, sortedSimilarityArray[i]);
			const nextTokens = textData[3];
			textTokens += parseInt(nextTokens);
			output.text += textData[2] + '\n';
			output.sources.push(textData[1]);
			if (textTokens > maxTextTokens){
				console.log(`embedding ${i + 1} texts (within a single message, with total length of ${textTokens}, with cap of ${maxTextTokens}`);
				break;
			}
		}
		output.tokens = textTokens;
		return output;	
	}
	catch(error){
		console.error(error);
	}
}

async function getQuery(query){
	console.log(`getting query...${query}`);
	var output = {text: '', sources: [], tokens: 0};
	try{
		const texts = await getTopRankedTexts(query);
		output.text += 'Question: ' + query + '\n';
		output.text += 'Relevant regulations: ' + texts.text;
		output.sources = texts.sources;
		output.tokens = texts.tokens;
		return output;
		}
	catch(error){
		console.error(error);
		}
}

async function parseMessages(messages){
	var numberTokens = await numTokensFromMessages(messages);
	console.log(`number of tokens: ${numberTokens}`);
	console.log(`tokens to ceiling: ${(tokenCeiling - numberTokens)}`);
	while ((tokenCeiling - numberTokens) < responseLength){
		const cutMessages = messages.splice(1, 2);
		console.log('cut messages:');
		console.log(cutMessages);
		numberTokens = await numTokensFromMessages(messages);
	}
	return messages;	
}

async function getFrontendDiagnostics(messages){
	return {numberMessages: messages.length,
			messages: messages};
}

module.exports = {getQuery: getQuery, parseMessages: parseMessages, getFrontendDiagnostics: getFrontendDiagnostics};