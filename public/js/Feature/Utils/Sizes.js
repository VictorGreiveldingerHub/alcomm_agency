import EventEmitter from "./EventEmitter.js";

export default class Sizes extends EventEmitter {
  constructor(feature) {
    super();

    this.feature = feature;

    if (!this.feature.canvas) return;

    this.width = this.feature.canvas.clientWidth;
    this.height = this.feature.canvas.clientHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize", () => {
      this.width = this.feature.canvas.clientWidth;
      this.height = this.feature.canvas.clientHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });
  }
}
