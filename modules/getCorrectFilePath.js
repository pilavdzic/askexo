const PRODUCTION = true;

const correctFilePath = function (){
	const nodeModulesPath = (PRODUCTION) ? '/../../../home/korby/node_modules/' : 'C:/Users/mattc/node_modules';
	const dataFolderPath = (PRODUCTION)? '/var/www/askexo/data/' : 'C:/Users/mattc/Documents/Projects/askexo/data/';
	return {nodeModulesPath: nodeModulesPath, dataFolderPath: dataFolderPath};
}()

module.exports = correctFilePath