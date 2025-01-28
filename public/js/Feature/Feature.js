import { Scene } from "three";

import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Grid from "./Grid/Grid.js";
import Loader from "./Loader/Loader.js";
import Resources from "./Utils/Resources.js";
import Repulsion from "./Repulsion/Repulsion.js";
import sources from "./sources.js";

export default class Feature {
  constructor(canvas, fov, position, effectTypes) {
    // Options
    this.canvas = canvas.instance; // initialise le canvas
    this.fov = fov;
    this.position = position;

    // Initialisation
    this.sizes = new Sizes(this); // initialise les tailles
    this.time = new Time();
    this.scene = new Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera(this, this.fov, this.position);
    this.renderer = new Renderer(this);

    // Initialiser les effets en fonction des types
    this.effects = {};
    if (effectTypes.includes("grid")) {
      this.effects.grid = new Grid(this);
    }
    if (effectTypes.includes("repulsion")) {
      this.effects.repulsion = new Repulsion(this);
    }
    if (effectTypes.includes("loader")) {
      this.effects.loader = new Loader(this);
    }

    // Ecouteur d'evenements
    this.sizes.on("resize", () => {
      this.resize();
    });

    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    for (const effect in this.effects) {
      if (this.effects[effect].resize) {
        this.effects[effect].resize();
      }
    }
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    for (const effect in this.effects) {
      if (this.effects[effect].update) {
        this.effects[effect].update();
      }
    }
    this.renderer.update();
  }

  getEffect(effectType) {
    return this.effects[effectType];
  }
}
