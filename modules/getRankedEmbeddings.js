const nodeModulesPath = require('./getNodeModulesPath')
const getQueryEmbedding = require('./getQueryEmbedding').getQueryEmbedding
const Decimal = require(`${nodeModulesPath}/decimal.js`);
const { parse } = require(`${nodeModulesPath}/csv-parse`);
const { createReadStream } = require('fs');
const dataPath = './data/'

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

async function getRankedEmbeddings(txt) {
  try {
    let rowNumber = 0;
    const output = [];
    const maxOutputRows = 25;

    const qryEmbed = await getQueryEmbedding(txt);
    const stream = createReadStream(dataPath + 'embeddings.csv').pipe(parse({ delimiter: ',', from_line: 2 }));

    stream.on('data', (row) => {
      rowNumber += 1;
	  if (rowNumber % 200 === 0){
		  console.log('streaming row ' + rowNumber);
	  }
      var lineData = row;
	  const reg = lineData.shift();
	  const hash = lineData.shift();
      const similarity = vectorSimilarity(qryEmbed, lineData);
      if (output.length < maxOutputRows) {
        output.push([similarity, rowNumber, reg]);
      } else {
        const last = output.pop();
        const toAdd = (similarity > last[0]) ? [similarity, rowNumber, reg] : last;
        output.push(toAdd);
      }
      output.sort((a, b) => b[0] - a[0]);
    });

    return new Promise((resolve, reject) => {
      stream.on('end', () => {
        resolve(output);
      });
      stream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}


/*
async function getRankedEmbeddings(txt) {
  return new Promise((resolve, reject) => {
    let rowNumber = 0;
    const output = [];
    const maxOutputRows = 25;

    const qryEmbed = await getQueryEmbedding(txt);
    const stream = createReadStream(dataPath + 'embeddings.csv')
      .pipe(parse({ delimiter: ',', from_line: 2 }));

    stream.on('data', (row) => {
      rowNumber += 1;
      var lineData = row;
	  const reg = lineData.shift();
	  const hash = lineData.shift();
      const similarity = vectorSimilarity(qryEmbed, lineData);
      if (output.length < maxOutputRows) {
        output.push([similarity, rowNumber, reg]);
      } else {
        const last = output.pop();
        const toAdd = (similarity > last[0]) ? [similarity, rowNumber, reg] : last;
        output.push(toAdd);
      }
      output.sort((a, b) => b[0] - a[0]);
    });

    stream.on('end', () => {
      resolve(output);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}
*/
/*

async function getRankedEmbeddings(txt){
	var rowNumber = 0;
	const output = [];
	const maxOutputRows = 25;
	try{
		const qryEmbed = await getQueryEmbedding(txt);
		fs.createReadStream(dataPath + 'embeddings.csv')
		.pipe(parse({ delimiter: ",", from_line: 2 }))
		.on("data", function (row) {
			rowNumber += 1;
			var lineData = row;
			const reg = lineData.shift();
			const hash = lineData.shift();
			const similarity = vectorSimilarity(qryEmbed, lineData);
			if (output.length < maxOutputRows){
				output.push([similarity, rowNumber, reg]);
			}
			else{
				const last = output.pop();
				//console.log((similarity > last[0]) ? 'new one ' + similarity + '>' + last[0] : 'old one '+ last[0] + '>' + similarity);
				const toAdd = (similarity > last[0]) ? [similarity, rowNumber, reg] : last;
				output.push(toAdd);
			}
			output.sort(function(a, b) {
				return b[0] - a[0];
			});
		})
		.on("end", function () {
			//console.log("finished");
			//console.log(output);
			return output;
		})
		.on("error", function (error) {
			console.log(error.message);
		});
		}
	catch(error){
		console.error(error);
		}
}
*/

module.exports = getRankedEmbeddings;