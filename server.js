var express = require("express")
var app = express();
const csv = require('csv-parser');
const fs = require('fs');

//The CSV file with data for the 2019 tournament
const data2019 = './2019data.csv';


// Set EJS as templating engine
app.set('view engine', 'ejs');

//Serve static files from public dir
app.use(express.static(__dirname + '/public'));

app.get("/",function(req,res){
    let tableData = [
        {team: "Coming soon", r1: "", r2: "", r3: "", r4: "", r5: "", r6: ""},
        ];
    res.render('index',{year:2020, tableData: tableData});
});

//Route for the 2019 predictions page
app.get("/2019",function(req,res){
    //Vars to be sent to the template engine
    var year = 2019;
    var tableData = [];

    //Read from the csv for 2019 data and create a tableData to send to template engine
    fs.createReadStream(data2019)
        .on('error', () => {
            // handle error
        })
        .pipe(csv())
        .on('data', (row) => {
            //Create a row to add to the tableData and format the data properly
            var rowToAdd = {
                team: row[0].slice(0,-5).padStart(2, '0'),
                team_stat: row[2],
                r1: String(Number.parseFloat(row[1]).toFixed(3)),
                r2: String(Number.parseFloat(row[3]*100).toFixed(3)).padStart(6,'0'),
                r3: String(Number.parseFloat(row[4]*100).toFixed(3)).padStart(6,'0'),
                r4: String(Number.parseFloat(row[5]*100).toFixed(3)).padStart(6,'0'),
                r5: String(Number.parseFloat(row[6]*100).toFixed(3)).padStart(6,'0'),
                r6: String(Number.parseFloat(row[7]*100).toFixed(3)).padStart(6,'0'),
                r7: String(Number.parseFloat(row[8]*100).toFixed(3)).padStart(6,'0')
            };
            //Push the new row to tableData
            tableData.push(rowToAdd)
        })
        .on('end', () => {

            //remove first item from tableData since it is the header of the CSV
            tableData.shift();

            //Sort by Likely hood to win championship based on model
            tableData.sort((row1, row2) => row1['r7'] - row2['r7']).reverse();

            //Submit the data now that the CSV is loaded.  Render the template and display the HTML
            res.render('index',{year:year, tableData: tableData});
        })
});


app.use("*",function(req,res){
  res.render('404');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running");
});
