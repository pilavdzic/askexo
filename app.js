const express = require('../../../home/korby/node_modules/express');
var app = express();

//app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
});

app.listen(process.env.PORT || 3000)