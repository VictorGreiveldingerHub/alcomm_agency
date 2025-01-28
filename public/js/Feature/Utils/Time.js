import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.start = Date.now(); // temps de départ
    this.current = this.start; // temps actuel, s'incrémente à chaque frame
    this.elapsed = 0; // temps écoulé depuis le début de l'expérience
    this.delta = 16; // proche du nombre de millisecondes de l'intervalle entre deux frames à 60fps

    // Attendre une frame pour être sûr que tout est initialisé
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
