const express = require("express");
const app = express();
const port = 3000;
const router = require("./modules/router");

// Dire a express quel moteur de view utiliser
// Il va se charger de le require dans la foulée
app.set("view engine", "ejs");
app.set("views", "views");

// J'informe express que mes fichiers statiques sont la.
app.use(express.static("public"));
app.use(router);

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
