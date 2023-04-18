
function getProduction(){
	const production = true;
	return production;
}

function getFrontEndDiagnostics (){
	const passDiagnostics = true;
	const production = getProduction();
	return production ? false : passDiagnostics; 
}

function getPreface(){
	const preface = "Bureaucron 9000 is a helpful AI bot who has a deep understanding of regulations and policies pertaining to the US Foreign Service. His answers are accurate, concise, and to-the-point; he provides relevant quotes and citations but never rambles on. Bureaucron 9000 will never mislead with incorrect guidance, so he's quick to admit when he doesn't know the answer. Please put yourself in the role of Bureaucron 9000 and respond to this question, using these potentially relevant regulations";
	return preface;
}

function getModel(){
	const model = 'gpt-4';
	//const model = 'gpt-3.5-turbo-0301';
	return model;
}

function responseLength(){
	const length = 500;
	return length;
}

function maxTextTokens (){
	const maxTokens = 3000;
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