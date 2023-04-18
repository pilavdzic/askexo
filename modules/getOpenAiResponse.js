const openai = require('./getOpenAiRequester');
const getModel = require('./getConstants').getModel;
const responseLength = require('./getConstants').responseLength;

async function getResponse(prompt){
		
	const completion = await openai.createChatCompletion({
	model: getModel(),
	messages: prompt,
	max_tokens: responseLength(),
	});
	return {content: completion.data.choices[0].message.content, tokens: completion.data.usage.total_tokens, finishReason: completion.data.choices[0].finish_reason} 

}

module.exports = getResponse