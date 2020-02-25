var express = require("express")
var app = express();
const csv = require('csv-parser');
const fs = require('fs');

//The CSV file with data for the 2019 tournament
const data2019 = './2019data.csv'


// Set EJS as templating engine
app.set('view engine', 'ejs');


app.get("/",function(req,res){
    let tableData = [
        {team: "Duke", r1: "100", r2: "50", r3: "30", r4: "10", r5: "8", r6: "3"},
        {team: "Duke", r1: "100", r2: "50", r3: "30", r4: "10", r5: "8", r6: "3"},
        {team: "Duke", r1: "100", r2: "50", r3: "30", r4: "10", r5: "8", r6: "3"}
        ];
    res.render('index',{year:2020, tableData: tableData});
});

//Route for the 2019 predictions page
app.get("/2019",function(req,res){
    //Vars to be sent to the template engine
    var year = 2019
    var tableData = []

    //Read from the csv for 2019 data and create a tableData to send to template engine
    fs.createReadStream(data2019)
        .on('error', () => {
            // handle error
        })
        .pipe(csv())
        .on('data', (row) => {
            var rowToAdd = {team: row[0].slice(0,-5), r1: Math.floor(row[2]*100), r2: Math.floor(row[3]*100), r3: Math.floor(row[4]*100), r4: Math.floor(row[5]*100), r5: Math.floor(row[6]*100), r6: Math.floor(row[7]*100)}
            tableData.push(rowToAdd)
        })
        .on('end', () => {
            // handle end of CSV
            //remove first item from tableData since it is the header of the CSV
            tableData.shift()

            //Submit the data now that the CSV is loaded.  Render the template and display the HTML
            res.render('index',{year:year, tableData: tableData});
        })
});


app.use("*",function(req,res){
  res.render('404');
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
