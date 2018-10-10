const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.end.PORT

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',function(req, res){
    res.sendFile(__dirname + '/public/index.html')
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});