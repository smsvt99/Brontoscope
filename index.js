const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT
// const port = 5000
const calendar = require('./brontoscopeModule.js')


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',function(req, res){
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/api/:date', function(req, res) {
    res.set('Access-Control-Allow-Origin', '*')
    res.json({ 
        date: req.params.date,
        english: calendar.english[req.params.date],
        greek: calendar.greek[req.params.date]
    });   
});
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

