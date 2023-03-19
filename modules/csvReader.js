const nodeModulesPath = require('./getCorrectFilePath').nodeModulesPath;
const dataFolderPath = require('./getCorrectFilePath').dataFolderPath;
const papa = require(`${nodeModulesPath}/papaparse`);
const fs = require('fs').promises;

var folderPath = dataFolderPath + 'texts/'
var logFilePath = dataFolderPath + 'log/'

async function logQueryResponse(query, response, sources, tokens) {

	const timestamp = new Date().toISOString();

	fs.appendFile(logFilePath + 'output_log.csv', `${timestamp}, ${query}, ${response}, ${sources.join(', ')}, ${tokens}\n`)
	.then(() => {
		console.log('Data appended to file');
	})
	.catch((err) => {
		console.error(err);
	});
}


async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath,'utf8');
	return data;
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

async function getDataArray(fileName){
  try {
    const data = await readFile(folderPath + fileName);
    const parsedData = papa.parse(data, {skipEmptyLines:true});
    return parsedData.data;
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}


  
module.exports = {getDataArray: getDataArray, logQueryResponse: logQueryResponse}