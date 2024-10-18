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

app.get('/infoGOT/:id', (req, res) => {
  const characterId = req.params.id; // Obtiene el ID del personaje de la URL
  const url = `https://ThronesApi.com/api/v2/Characters/${characterId}`; // Actualiza la URL con el ID

  https.get(url, (response) => {
      console.log("Got a response");
      let resContent = "";

      response.on("data", (data) => {
          resContent += data;
      }).on("end", () => {
          try {
              const jsonObj = JSON.parse(resContent);
              console.log(jsonObj); // Log para verificar la estructura de datos

              // Almacena el personaje en la variable
              personaje = jsonObj;

              res.redirect("/"); // Redirige a la página de inicio
          } catch (error) {
              console.error("Error parsing JSON:", error);
              res.redirect("/");
          }
      }).on("error", (e) => {
          console.error(`Got an error: ${e.message}`);
          res.redirect("/");
      });
  });
});

app.get('/search', (req, res) => {
  const id = req.query.id; // Obtiene el ID del personaje desde la consulta
  console.log("Consulta de búsqueda por ID:", id); // Log para verificar el valor del ID

  const url = `https://thronesapi.com/api/v2/Characters/${id}`; // URL de la API para buscar por ID
  https.get(url, (response) => {
      let resContent = "";

      response.on("data", (data) => {
          resContent += data;
      }).on("end", () => {
          try {
              const personaje = JSON.parse(resContent);
              console.log("Resultado de la API:", personaje); // Log para verificar el resultado

              // Renderiza la vista con el personaje
              res.render('buscar', { personaje: personaje });
          } catch (error) {
              console.error("Error parsing JSON:", error);
              res.redirect("/"); // Redirige en caso de error
          }
      }).on("error", (e) => {
          console.error(`Got an error: ${e.message}`);
          res.redirect("/"); // Redirige en caso de error
      });
  });
});

app.get('/', (req, res) => {
  res.render('home', { personaje : personaje}); // Render
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});