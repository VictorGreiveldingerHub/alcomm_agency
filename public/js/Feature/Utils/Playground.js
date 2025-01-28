// Sert de terrain de jeu pour l'arriere plan du site
// Création du canvas et du contexte pour les futurs "dessins"

export default class Playground {
  constructor(
    witdh,
    height,
    image,
    canvasCursor,
    canvasCursorPrevious,
    screenCursor
  ) {
    // Options
    this.width = witdh;
    this.height = height;
    this.imageSrc = image;
    this.canvasCursor = canvasCursor;
    this.canvasCursorPrevious = canvasCursorPrevious;
    this.screenCursor = screenCursor;

    // Initialisation
    this.setImage();
    this.setCanvas();
    this.setContext();
  }

  setCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setContext() {
    this.context = this.canvas.getContext("2d");
    this.context.fillRect(0, 0, this.width, this.height);

    this.glowSize = this.canvas.width * 0.4;

    this.context.globalCompositeOperation = "source-over";
    this.context.globalAlpha = 0.02;

    this.context.fillRect(0, 0, this.width, this.height);

    this.context.globalCompositeOperation = "lighten";
    this.context.globalAlpha = 1;

    this.context.drawImage(
      this.image,
      this.canvasCursor.x - this.glowSize * 0.5,
      this.canvasCursor.y - this.glowSize * 0.5,
      this.glowSize,
      this.glowSize
    );
  }

  setImage() {
    this.image = new Image();
    this.image.src = this.imageSrc;
  }

  resize() {
    this.setCanvas();
    this.setContext();

    this.texture.needsUpdate = true;
  }
}
