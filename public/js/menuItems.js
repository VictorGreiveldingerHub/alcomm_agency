import { gsap } from "gsap";

class Item {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }

  // Fonction split
  splitName() {
    return this.name
      .split("")
      .map((letter) => `<span>${letter}</span>`)
      .join("");
  }
}

class Menu {
  constructor(navItems, containerSelector = ".main_navigation") {
    this.navItems = navItems;
    this.container = document.querySelector(containerSelector);
  }

  createMenu() {
    if (!this.container) return;

    const menuList = document.createElement("ul");
    menuList.classList.add("main_navigation_list_items");
    this.container.appendChild(menuList);

    this.navItems.forEach((item) => {
      const menuItem = this.createMenuItem(item);
      menuList.appendChild(menuItem);
    });
  }

  createMenuItem(itemData) {
    const menuItem = document.createElement("li");
    menuItem.classList.add("main_navigation_item");

    const menuLink = document.createElement("a");
    menuLink.classList.add("main_navigation_link");
    menuLink.href = itemData.url;
    menuLink.innerHTML = new Item(itemData.name, itemData.url).splitName();

    if (window.location.pathname === itemData.url) {
      menuLink.classList.add("active");
    }

    menuItem.appendChild(menuLink);
    this.addHoverAnimation(menuLink);

    return menuItem;
  }

  // Ajouter une animation au survol
  addHoverAnimation(link) {
    // Utiliser un flag pour s'assurer que l'animation ne se déclenche qu'une fois par survol
    let isAnimating = false;

    link.addEventListener("mouseenter", () => {
      if (!isAnimating) {
        isAnimating = true;

        gsap.to(link.querySelectorAll("span"), {
          opacity: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: "power1.out",
          onComplete: () => {
            gsap.to(link.querySelectorAll("span"), {
              opacity: 1,
              stagger: 0.05,
              duration: 0.3,
              ease: "power1.in",
              onComplete: () => {
                isAnimating = false; // Réinitialiser le flag à la fin de l'animation
              },
            });
          },
        });
      }
    });
  }
}

// Fonction pour initialiser le menu Voir pour améliorer
export function initMenu(navItems) {
  const menu = new Menu(navItems);
  menu.createMenu();
}
