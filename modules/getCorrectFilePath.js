const getConstants = require('./getConstants');
const production = getConstants.getProduction();

const correctFilePath = function (){
	const nodeModulesPath = (production) ? '/../../../home/korby/node_modules/' : 'C:/Users/mattc/node_modules';
	const dataFolderPath = (production)? '/var/www/askexo/data/' : 'C:/Users/mattc/Documents/Projects/askexo/data/';
	return {nodeModulesPath: nodeModulesPath, dataFolderPath: dataFolderPath};
}()

module.exports = correctFilePath