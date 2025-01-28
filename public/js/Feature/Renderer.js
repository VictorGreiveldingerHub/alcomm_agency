import { WebGLRenderer } from "three";

export default class Renderer {
  constructor(feature) {
    this.feature = feature;

    this.canvas = this.feature.canvas;
    this.sizes = this.feature.sizes;
    this.scene = this.feature.scene;
    this.camera = this.feature.camera;

    this.setInstance();
  }

  setInstance() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });

    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
