const nodeModulesPath = require('./getNodeModulesPath')
//const linearAlgebra = require(`${nodeModulesPath}/linear-algebra`)();
const getQueryEmbedding = require('./getQueryEmbedding').getQueryEmbedding
const { dot } = require(`${nodeModulesPath}/mathjs`)
//const Vector = linearAlgebra.Vector;
//const Matrix = linearAlgebra.Matrix;

//const a = [.1212,.142124,.23234234]
//const b = [.2,.3,.4]
//console.log('check this...')
//console.log(dot(a,b));

const sample = Array.from({ length: 3 }, () =>
    Array.from({ length: 4096 }, () => 
        Math.random()
      )
    );

function vectorSimilarity(x, y){
	//console.log(x)
	//console.log('********')
	//console.log(y)
  //const xVect = new Matrix(x);
  //const yVect = new Matrix(y);
  return dot(x, y)
}

async function orderDocumentSectionsByQuerySimilarity(txt, embedArray){
	const output = [];
	const qryEmbed = await getQueryEmbedding(txt); 
	embedArray.forEach((x, i) => {
		output.push([vectorSimilarity(qryEmbed, x), i])
	});
	output.sort(function(a, b) {
		return a[0] - b[0];
	});
	console.log(output)
	return output;
}

function f(){
	return orderDocumentSectionsByQuerySimilarity('hello', sample)
}

module.exports = f