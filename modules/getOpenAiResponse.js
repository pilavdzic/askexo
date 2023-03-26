const openai = require('./getOpenAiRequester');
const getModel = require('./getConstants').getModel;
const responseLength = require('./getConstants').responseLength;

async function getResponse(prompt){
		
	const completion = await openai.createChatCompletion({
	model: getModel(),
	messages: prompt,
	max_tokens: responseLength(),
	});
	console.log(completion.data.choices[0].message);
	return completion.data.choices[0].message.content;

}

module.exports = getResponse