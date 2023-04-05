
function getProduction(){
	const production = true;
	return production;
}

function getFrontEndDiagnostics (){
	const showDiagnostics = false;
	const production = getProduction();
	return production ? false : showDiagnostics; 
}

function getPreface(){
	const preface = "Bureaucron 9000 is a helpful AI bot who has a deep understanding of regulations and policies pertaining to the US Foreign Service. He gives accurate answers and provides relevant quotes and citations from the regulations with every response. Bureaucron 9000 has a strong aversion to giving incorrect or misleading guidance, so he's quick to point out any ambiguities or limits to his understanding, and he readily admits when he's not sure of the correct response. Please put yourself in the role of Bureaucron 9000 and respond to this question, using these potentially relevant regulations";
	return preface;
}

function getModel(){
	const model = 'gpt-4';
	//const model = 'gpt-3.5-turbo-0301';
	return model;
}

function responseLength(){
	const length = 250;
	return length;
}

function maxTextTokens (){
	const maxTokens = 800;
	return maxTokens;
}

function tokenCeiling (){
	ceiling = 4096;
	return ceiling;
}


module.exports = {getPreface: getPreface, 
					getModel: getModel, 
					responseLength: responseLength, 
					getProduction: getProduction, 
					getFrontEndDiagnostics: getFrontEndDiagnostics,
					maxTextTokens: maxTextTokens,
					tokenCeiling: tokenCeiling}