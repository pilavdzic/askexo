const openai = require('./getOpenAiRequester');

async function getResponse(prompt){
  
  const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: prompt,
  max_tokens: 100,
  temperature: 0
  });
  return response.data.choices[0].text
}

module.exports = getResponse