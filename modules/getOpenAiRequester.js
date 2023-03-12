const nodeModulesPath = require('./getCorrectFilePath').nodeModulesPath;
const { Configuration, OpenAIApi } = require(`${nodeModulesPath}/openai`);

const apiKey = process.env.API_KEY || require('../env/env.js');
const configuration = new Configuration({
  apiKey: apiKey
});
const openai = new OpenAIApi(configuration);

module.exports = openai;