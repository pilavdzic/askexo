const { promisify } = require('util');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const nodeModulesPath = require('./getNodeModulesPath')
const getQueryEmbedding = require('./getQueryEmbedding').getQueryEmbedding
const Decimal = require(`${nodeModulesPath}/decimal.js`);
const { parse } = require(`${nodeModulesPath}/csv-parse`);
//const fs = require('fs');
const path = require('path');
const folderPath = './data/embeddings/'

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
    let output = [];
    const maxOutputRows = 25;
	const qryEmbed = await getQueryEmbedding(txt);

	console.time('loading files');
	
	const files = await readdir(folderPath);
	const csvFiles = files.filter((file) => path.extname(file) === '.csv');
	
	for (const csvFile of csvFiles) {
	  const csvFilePath = path.join(folderPath, csvFile);

      const data = await readFile(csvFilePath, 'utf8');
	  
	  // Parse the CSV data using csv-parse
      const parsedData = await new Promise((resolve, reject) => {
        parse(data, { delimiter: ',', from_line: 2 }, (err, parsedData) => {
          if (err) {
            reject(err);
          } else {
            resolve(parsedData);
          }
        });
      });
		
      parsedData.forEach((row) => {
        const rowNumber = row.shift();
		const reg = row.shift();
        const hash = row.shift();
        const similarity = vectorSimilarity(qryEmbed, row);
        if (output.length < maxOutputRows) {
          output.push([similarity, rowNumber, reg]);
        } else {
          const last = output.pop();
          const toAdd = (similarity > last[0]) ? [similarity, rowNumber, reg] : last;
          output.push(toAdd);
        }
        output.sort((a, b) => b[0] - a[0]);
      });
    }

    console.timeEnd('loading files');
    console.log(output);
    return output;

  } catch (error) {
    console.log(error);
    throw error;
  }
}
	
module.exports = getRankedEmbeddings;