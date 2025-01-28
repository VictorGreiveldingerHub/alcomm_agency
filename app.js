import Feature from "./public/js/Feature/Feature.js";
import Canvas from "./public/js/Feature/Utils/Canvas.js";
import { initMenu } from "./public/js/menuItems.js";
import Studio from "./public/js/studio.js";
import Galery from "./public/js/galery.js";

const g = new Galery();
// Récupération de la div ou le canvas sera inséré et creation du canvas associé
const cGrid = new Canvas("cGrid", "absolute", 1);
const cPhotographe = new Canvas("cPhotographe", "relative", 10);
const cGraphiste = new Canvas("cGraphiste", "relative", 10);
const cAgency = new Canvas("cAgency", "relative", 10);
const cNumber = new Canvas("cNumber", "relative", "40%", "-35%", 10);

// Création de la fonctionnalité selon le canvas
const gridFeature = new Feature(cGrid, 45, 2, ["grid"]);
const photographe = new Feature(cPhotographe, 75, 7.5, ["repulsion"]);
photographe.type = "PHOTOGRAPHE";
const graphiste = new Feature(cGraphiste, 75, 10, ["repulsion"]);
graphiste.type = "GRAPHISTE";
const agence = new Feature(cAgency, 45, 10, ["repulsion"]);
agence.type = "ALCOMM' AGENCY";
const numbers = new Feature(cNumber, 45, 10, ["repulsion"]);
numbers.type = "NUMBER";

// Utils
const menuItems = [
  {
    name: "L'agence",
    url: "/studio",
  },
  {
    name: "Galerie",
    url: "/galerie",
  },
  {
    name: "Contact",
    url: "/contact",
  },
];

// Initialiser le menu avec les éléments de menu définis
document.addEventListener("DOMContentLoaded", () => {
  initMenu(menuItems);
  gridFeature.getEffect("grid");
  photographe.getEffect("repulsion");
  graphiste.getEffect("repulsion");
  agence.getEffect("repulsion");
  numbers.getEffect("repulsion");
  new Studio({
    containerSelector: ".studio-container", // Conteneur principal
    sectionSelector: ".container", // Sections à observer
    navLinkSelector: ".studio-navigation a", // Liens de navigation
    dynamicTitleSelector: "#main-title", // Élément pour les titres dynamiques
  });
});
