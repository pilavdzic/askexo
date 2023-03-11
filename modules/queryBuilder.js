const nodeModulesPath = require('./getNodeModulesPath')
const {encode, decode} = require(`${nodeModulesPath}/gpt-3-encoder`)
const csvReader = require('./csvReader')
const getRankedEmbeddings = require('./getRankedEmbeddings');

const preface = "Billy is a helpful, serious, and meticulous policy expert, who has a deep understanding of US Government Federal Travel regulations. He clearly understands that he should look for answers first in the most relevant policies (the ADS), and only afterward in the more general ones (the FAM, the FAH, and the FTR). He responds to all questions in as much detail as possible, and given his rather pedantic nature he gives relevant quotes and citations from the regulations with every response. Always eager to provide the most accurate answer he can, Billy has a strong aversion to giving incorrect or misleading guidance, so he's quick to point out any ambiguities or limits to his understanding, and he readily admits when he's not sure of the correct response. Please put yourself in the role of Billy and respond to this question, using these potentially relevant regulations";
const prefaceTokens = encode(preface).length;
const responseTokens = 500;
const maxTokens = 2000;
const textFile = 'texts.csv';

async function getTopRankedTexts(query){
	var output = '';
	const queryTokens = encode(query).length;
	try{
		const textArray = await csvReader(textFile);
		console.log('received text file of length: ' + textArray.length);
		const sortedSimilarityArray = await getRankedEmbeddings(query);
		console.log('received prioritized embeddings: ' + sortedSimilarityArray.length);
		var totalTokens = prefaceTokens + queryTokens + responseTokens;
		for (var i = 0; i < sortedSimilarityArray.length; i++){
			const index = sortedSimilarityArray[i][1];
			const nextTokens = textArray[index][3];
			if (parseInt(totalTokens) + parseInt(nextTokens) > maxTokens){
				break;
			}
			totalTokens += parseInt(nextTokens);
			output += textArray[index][2] + '\n';
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