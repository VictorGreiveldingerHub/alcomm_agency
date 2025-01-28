const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Alcomm' Agency",
  });
});

router.get("/studio", (req, res) => {
  res.render("studio", {
    title: "Alcomm' Agency",
  });
});

router.get("/galerie", (req, res) => {
  res.render("galerie", {
    title: "Galerie",
  });
});

router.get("/galerie/evenements", (req, res) => {
  res.render("evenements", {
    title: "Galerie - Evènements",
  });
});

router.get("/galerie/sport", (req, res) => {
  res.render("sport", {
    title: "Galerie -- Sport'",
  });
});

router.get("/galerie/graphisme", (req, res) => {
  res.render("graphisme", {
    title: "Galerie -- Graphisme'",
  });
});

router.get("/galerie/management", (req, res) => {
  res.render("management", {
    title: "Galerie -- Management'",
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
  });
});

module.exports = router;
