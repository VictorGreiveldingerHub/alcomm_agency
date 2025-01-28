import { TextureLoader, ImageLoader, LoadingManager } from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import EventEmitter from "./EventEmitter.js";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();
    this.sources = sources;

    this.items = {}; // les ressources chargées
    this.toLoad = this.sources.length; // le nombre de ressources à charger
    this.loaded = 0; // le nombre de ressources chargées

    this.setLoaders();
    this.startLoading();
  }

  // Initialisation des loaders
  setLoaders() {
    this.loader = {};
    this.loader.loadingManager = new LoadingManager(
      // Loaded
      () => {
        console.log("loaded");
      },
      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        console.log(itemsLoaded / itemsTotal);
      }
    );
    this.loader.textureLoader = new TextureLoader();
    this.loader.fontLoader = new FontLoader();
    this.loader.imageLoader = new ImageLoader();
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "font") {
        this.loader.fontLoader.load(source.path, (font) => {
          this.sourceLoaded(source, font);
        });
      } else if (source.type === "texture") {
        this.loader.textureLoader.load(source.path, (texture) => {
          this.sourceLoaded(source, texture);
        });
      } else {
        this.loader.imageLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
