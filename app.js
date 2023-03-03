const express = require('../../../home/korby/node_modules/express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.send('Working now')
});
app.listen(process.env.PORT || 3000)