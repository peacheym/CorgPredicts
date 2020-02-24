var express = require("express")
var app = express();
var path = __dirname + '/public/';

// Set EJS as templating engine
app.set('view engine', 'ejs');


app.get("/",function(req,res){
  res.render('index', {year:2020});
});

app.get("/2019",function(req,res){
  res.render('index',{year:2019});
});


app.use("*",function(req,res){
  res.render('404');
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
