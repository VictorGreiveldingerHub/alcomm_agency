// Creation du canvas associé
import EventEmitter from "./EventEmitter";

export default class Canvas extends EventEmitter {
  constructor(name, position, top = null, left = null, zIndex = 1) {
    super();

    this.name = name;
    this.position = position;
    this.top = top;
    this.left = left;
    this.width = "100%";
    this.height = "100%";
    this.overflow = "hidden";
    this.zIndex = zIndex;

    this.instance = this.initCanvas();

    window.addEventListener("resize", () => {
      if (!this.instance) return;
      this.instance.style.width = this.width;
      this.instance.style.height = this.height;

      this.trigger("resize");
    });
  }

  initCanvas() {
    const div = document.getElementById(this.name);
    const a = document.createElement("a");
    a.classList = "test";
    a.href = "/galerie";
    const canvas = document.createElement("canvas");

    if (!div) {
      return;
    }

    canvas.style.width = this.width;
    canvas.style.height = this.height;
    canvas.style.position = this.position;
    canvas.style.top = this.top;
    canvas.style.left = this.left;
    canvas.style.overflow = this.overflow;
    canvas.style.zIndex = this.zIndex;

    a.append(canvas);
    div.append(canvas);
    return canvas;
  }

  getCanvas() {
    return this.instance;
  }
}
