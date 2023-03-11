const nodeModulesPath = require('./getNodeModulesPath')
const getQueryEmbedding = require('./getQueryEmbedding').getQueryEmbedding
const csvReader = require('./csvReader')
const Decimal = require(`${nodeModulesPath}/decimal.js`);

function vectorSimilarity(array1, array2) {
  if (array1.length !== array2.length) {
    throw new Error("Arrays must have the same length");
  }
  let result = new Decimal(0);
  for (let i = 0; i < array1.length; i++) {
    result = result.plus(array1[i].times(array2[i]));
  }
  return result;
}

async function getRankedEmbeddings(txt){
	const output = [];
	try{
		const embedArray = await csvReader('embeddings.csv');
		console.log('how many embeddings found: ' + embedArray.length);
		const qryEmbed = await getQueryEmbedding(txt);
		console.log('query embedding found? array length: ' + qryEmbed.length);
		embedArray.forEach((x, i) => {
			if (i === 0){
				return;
			}
			xTrunc = x;
			const reg = xTrunc.shift();
			const hash = xTrunc.shift();
			output.push([vectorSimilarity(qryEmbed, xTrunc), i, reg])
		});
		output.sort(function(a, b) {
			return b[0] - a[0];
		});
		for (var i = 0 ; i < 3; i++){
			console.log(output[i]);	
		}
		return output;
		}
	catch(error){
		console.error(error);
		}
}

module.exports = getRankedEmbeddings;