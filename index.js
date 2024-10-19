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

app.get('/', (req, res) => {
  const url = `https://thronesapi.com/api/v2/Characters`; // URL para obtener todos los personajes

  https.get(url, (response) => {
      let resContent = "";

      response.on("data", (data) => {
          resContent += data;
      }).on("end", () => {
          try {
              const personajes = JSON.parse(resContent); // Parsear la lista completa de personajes
              console.log("Lista de personajes obtenida:", personajes); // Verifica que los personajes están llegando

              // Renderizar la vista home.ejs y pasar la variable personajes
              res.render('home', { personajes: personajes });
          } catch (error) {
              console.error("Error parsing JSON:", error);
              res.redirect("/"); // Redirige en caso de error
          }
      }).on("error", (e) => {
          console.error(`Error: ${e.message}`);
          res.redirect("/"); // Redirige en caso de error
      });
  });
});


app.get('/', (req, res) => {
  res.render('home', { personajes : personaje});
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});