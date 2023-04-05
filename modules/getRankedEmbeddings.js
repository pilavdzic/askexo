const nodeModulesPath = require('./getCorrectFilePath').nodeModulesPath;
const getQueryEmbedding = require('./getQueryEmbedding').getQueryEmbedding;

const PineconeClient = require(`${nodeModulesPath}/@pinecone-database/pinecone`).PineconeClient;
const pinecone = new PineconeClient();

async function getRankedEmbeddings(txt) {
	let output = [];
	
	await pinecone.init({
		environment: 'us-east-1-aws',
		apiKey: '88359b91-a508-474b-ace5-29019fb42467',
	});

	const qryEmbed = await getQueryEmbedding(txt);
	
	const index = pinecone.Index("embeddings");
		
	const queryResponse = await index.query({
		queryRequest: {
			vector: qryEmbed,
			topK: 20,
			includeValues: true,
		},
		namespace: "",
	});
	
	queryResponse.matches.forEach((ele) => {
		output.push(ele.id);
	})
	
	return output;
}

	
module.exports = getRankedEmbeddings;