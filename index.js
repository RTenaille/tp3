const {query} = require("express");
const express = require("express");
const app = express();

const mysql = require('mysql');
const connect = mysql.createConnection({
    host : "localhost",
    user: "root",
    password : "admin18",
    database : "garage"
});

app.use(express.static("public"));
app.set('view engine', "ejs");
app.set('views', "./views");
app.listen(8000);

app.use(express.json());

app.get("/", function (request, response){
    response.render("index");

})

connect.connect(function(err){
    if(err) throw err;
    console.log("Bienvenue au garage de la galère");
    connect.query("SELECT * from voiture;", function(err, result) {
        if (err) throw err;
        console.log(result)
    })
});

app.get("/voitures", function(request, response){
    connect.query("SELECT * from voiture;", function(err, result) {
        if (err) throw err;
        console.log(result);
        response.status(200).json(result);
    })
});

app.post('/ajouter-voiture',(request, response) => {
    const queries = "INSERT INTO VOITURE (marque,model,kilometre) values ('"+request.body.marque+"','"+request.body.model+"','"+request.body.kilometres+"');";
    console.log(queries);
    connect.query(queries, function (err, result){
        if(err) throw err;
        console.log(result);
        response.status(200).json(result)
    })
});

app.get("/voitures/:id", function(request, response){
    connect.query("SELECT * from voiture WHERE id="+request.params.id+";", function(err, result) {
        if (err) throw err;
        console.log(result);
        response.status(200).json(result);
    })
});

app.get("/voitures-marque/:marque", function(request, response){
    const marque = request.params.marque;
    connect.query("SELECT * FROM voiture WHERE marque='"+marque+"';", function(err, result) {
        if (err) throw err;
        console.log(result);
        response.status(200).json(result);
    })
});

app.delete('/supp-voiture/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const query = "DELETE FROM VOITURE WHERE id="+id+ ";";
    connect.query(query, function (err, result){
        if (err) throw err;
        console.log(result);
        response.status(200).json(result);
    })
});

app.put("/voiture-up/:id", function (req, res) {
    const id = req.params.id;
    const { marque, model, kilometres } = req.body;
    connect.query(`UPDATE voiture SET marque='${marque}', model='${model}', kilometre='${kilometres}' WHERE id=${id}`, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.status(200).json(result);
    });
  });



