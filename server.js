"use strict";

const fs = require("fs");
const express = require("express");
const app = express();

const ip = "127.0.0.1";
const port = 8081;

app.set('view engine', 'ejs');
app.use(express.static("public"));

fs.readFile("nobel.csv", "UTF8", (error, data) => {

    let nobels = data.split("\n");
    //erase first row
    nobels.shift();

    let objects = nobels
        .filter(row => row !== "")
        .map(recordToObject);

    //console.log(objects.length);
    //console.log(Object.keys(objects));
    //console.log(Object.values(objects));

    app.get("/", (req, res) => {
        res.render("index", {
            winners: objects
            
        });
        
    });

    app.get("/winners/:subject", (req, res) => {
        let chosen_fach = req.params.subject;
        let fach = chosen_fach.charAt(0).toUpperCase() + chosen_fach.slice(1);
        let err;
        

        const winners = [];
        console.log(fach);
        

        for(var i=0; i<objects.length; i++) {
            for(let key in objects[i]) {
              if(objects[i][key].indexOf(fach)!=-1) {
                 winners.push(objects[i]);
              }
            }
          }

          if(winners.length <= 0){
err = 1;
          } else {
              err = 0;
          }

        res.render("fach", {
            
            subject: fach,
            err: err,
            winners: winners
        });
        

        
    });



});

const recordToObject = record => {
    const fields = record.split(",");
    return {
        year: fields[0],
        subject: fields[1],
        name: fields[2],
    };
};


app.listen(port, ip, () => {
    console.log(`Server läuft auf http://${ip}:${port}/`);
});
