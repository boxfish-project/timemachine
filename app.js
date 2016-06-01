var express = require('express');
var bodyParser = require('body-parser');
var execSync = require('child_process').execSync;
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.get('/time', function (req, res) {
  var result={
     date:Date.now()
  };
  res.send(JSON.stringify(result));
});

var formatDate=function(date){
    if(!date){
       date="Date Not Found";
       throw new TypeError("Date not found");
    }
    date=+date;
    if(isNaN(date)||isNaN(new Date(+date))){
        throw new TypeError("Date format error");
    }
    return new Date(+date);
}

app.post('/time', function(req,res){
    var date=req.body.date;
    var result={
    status:""
    };
    console.log(date);
    try{
        var formattedDate=formatDate(date);
        var dateResult=execSync('sudo date -s "'+formattedDate+'"');
        console.log("result",dateResult.toString());
        result.status="okay";
        result.date=Date.now();
        res.send(JSON.stringify(result));
    }catch(e){
       console.log(e,e.line,e.stack);
       result.status="Bad Input:"+date;
       res.status(400).send(JSON.stringify(result));
    }

});

app.use(express.static('public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Time Machine listening at http://%s:%s', host, port);
});
