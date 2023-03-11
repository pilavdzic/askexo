const nodeModulesPath = require('./getNodeModulesPath');
const papa = require(`${nodeModulesPath}/papaparse`);
const fs = require('fs').promises;

var dataPath = '../data/'

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
    const data = await readFile(dataPath + fileName);
    const parsedData = papa.parse(data, {skipEmptyLines:true});
    return parsedData.data;
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}
  
module.exports = getDataArray