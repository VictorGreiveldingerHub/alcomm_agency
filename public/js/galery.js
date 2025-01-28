export default class Galery {
  constructor() {
    this.hoverItems();
  }

  hoverItems() {
    const hoverItems = document.querySelectorAll(".galerie-item");

    const items = document.querySelectorAll(".rolling-text");
    items.forEach((item) => {
      let innerText = item.innerText;
      item.innerHTML = "";

      let textContainer = document.createElement("div");
      textContainer.classList.add("block");

      for (let letter of innerText) {
        let span = document.createElement("span");
        span.innerText = letter.trim() == "" ? "\xa0" : letter;

        span.classList.add("letter");
        textContainer.appendChild(span);
      }

      item.appendChild(textContainer);
      item.appendChild(textContainer.cloneNode(true));
    });

    hoverItems.forEach((item) => {
      item.addEventListener("mouseover", () => {
        item.classList.remove("play");
      });
    });
  }
}
