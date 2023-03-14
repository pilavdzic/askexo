const nodeModulesPath = require('./getCorrectFilePath').nodeModulesPath;
const {encode, decode} = require(`${nodeModulesPath}/gpt-3-encoder`)
const csvReader = require('./csvReader')
const getRankedEmbeddings = require('./getRankedEmbeddings');

const preface = "Bureaucron 9000 is a helpful, serious, and meticulous AI bot and policy expert, who has a deep understanding of US Government Federal Travel regulations. He clearly understands that he should look for answers first in the most relevant policies (the ADS), and only afterward in the more general ones (the FAM, the FAH, and the FTR). He responds to all questions in as much detail as possible, and given his rather pedantic nature he gives relevant quotes and citations from the regulations with every response. Always eager to provide the most accurate answer he can, Billy has a strong aversion to giving incorrect or misleading guidance, so he's quick to point out any ambiguities or limits to his understanding, and he readily admits when he's not sure of the correct response. Please put yourself in the role of Billy and respond to this question, using these potentially relevant regulations";
const prefaceTokens = encode(preface).length;
const responseTokens = 500;
const maxTokens = 2000;
const textFile = 'combined_data.csv';

//hash which is the key has to be in 0-index of the text array

function sortTexts(a, b){
	return a[0].localeCompare(b[0]);
}

function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid][0] === target) {
      return arr[mid];
    } else if (arr[mid][0] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

async function getTopRankedTexts(query){
	var output = '';
	const queryTokens = encode(query).length;
	try{
		const textArray = await csvReader(textFile);
		const sortedTextArray = textArray.sort(sortTexts);		
		const sortedSimilarityArray = await getRankedEmbeddings(query);
		
		var totalTokens = prefaceTokens + queryTokens + responseTokens;
		for (var i = 0; i < sortedSimilarityArray.length; i++){
			const textData = binarySearch(sortedTextArray, sortedSimilarityArray[i]);
			const nextTokens = textData[3];
			if (parseInt(totalTokens) + parseInt(nextTokens) > maxTokens){
				console.log('maxTokens: ' + maxTokens + ' / tokens: ' + totalTokens);
				break;
			}
			totalTokens += parseInt(nextTokens);
			output += textData[2] + '\n';
			console.log(textData[1]);
		}
		return output;	
	}
	catch(error){
		console.error(error);
	}
}

async function getQuery(query){
	console.log('getting query...');
	var output = '';
	try{
		const texts = await getTopRankedTexts(query);
		output += preface + '\n';
		output += 'Question: ' + query + '\n';
		output += 'Relevant regulations: ' + texts;
		return output;
		}
	catch(error){
		console.error(error);
		}
}

module.exports = getQuery;