const express = require('express');
const https = require("https");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(express.static('public'));

var personaje = "";
const url = `https://thronesapi.com/api/v2/Characters`; 

app.get('/', (req, res) => {
  https.get(url, (response) => {
      let resContent = "";

      response.on("data", (data) => {
          resContent += data;
      }).on("end", () => {
          try {
              const personajes = JSON.parse(resContent); 
              console.log("Lista de personajes obtenida:", personajes); 

              res.render('home', { personajes: personajes });
          } catch (error) {
              console.error("Error parsing JSON:", error);
              res.redirect("/"); 
          }
      }).on("error", (e) => {
          console.error(`Error: ${e.message}`);
          res.redirect("/"); 
      });
  });
});

app.get('/search', (req, res) => {
  const query = req.query.id.toLowerCase(); 
  let respuestas = [];

  https.get(url, (response) => {
      let resContent = "";

      response.on("data", (data) => {
          resContent += data;
      }).on("end", () => {
          try {
              const personajes = JSON.parse(resContent); 
              console.log("Lista completa de personajes:", personajes);

              respuestas = personajes.filter(personaje => {
                  return personaje.lastName.toLowerCase().includes(query) || 
                         personaje.firstName.toLowerCase().includes(query) ||
                         personaje.fullName.toLowerCase().includes(query) ||
                         personaje.title.toLowerCase().includes(query) ||
                         personaje.family.toLowerCase().includes(query);
              });

              if (respuestas.length > 0) {
                  res.render('buscar', { personajes: respuestas }); 
              } else {
                  res.render('buscar', { personajes: [] }); 
              }
          } catch (error) {
              console.error("Error parsing JSON:", error);
              res.redirect("/"); 
          }
      }).on("error", (e) => {
          console.error(`Error: ${e.message}`);
          res.redirect("/"); 
      });
  });
});

app.get('/', (req, res) => {
  res.render('home', { personaje : personaje});
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});