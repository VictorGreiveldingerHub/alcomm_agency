import { gsap } from "gsap";

export default class Studio {
  constructor(options) {
    const {
      containerSelector,
      sectionSelector,
      navLinkSelector,
      dynamicTitleSelector,
    } = options;

    this.sections = [...document.querySelectorAll(sectionSelector)];
    this.navLinks = [...document.querySelectorAll(navLinkSelector)];
    this.scrollContainer = document.querySelector(containerSelector);
    this.dynamicTitle = document.querySelector(dynamicTitleSelector);
    this.savedIndex = null;

    this.init();
    gsap
      .timeline()
      .set(".prestation", { autoAlpha: 1 })
      .from(".prestation-link", {
        delay: 1,
        duration: 0.85,
        xPercent: 25,
        yPercent: 125,
        stagger: 0.095,
        skewY: gsap.utils.wrap([-8, 8]),
        ease: "expo.out",
      })
      .set(".prestation", { pointerEvents: "all" });

    gsap.defaults({
      duration: 0.05,
      ease: "expo.out",
    });

    const prestationItems = document.querySelectorAll(".prestation-item");

    prestationItems.forEach((item) => {
      const imgWrapper = item.querySelector(".prestation-item_image-wrapper");

      const imageWrapperBounds = imgWrapper.getBoundingClientRect();

      let itemBounds = item.getBoundingClientRect;

      const onMouseEnter = () => {
        gsap.set(imgWrapper, {
          scale: 0.8,
          xPercent: 25,
          yPercent: 50,
          rotation: -15,
        });
        gsap.to(imgWrapper, {
          opacity: 1,
          scale: 1,
          yPercent: 0,
          rotation: 0,
        });
      };

      const onMouseLeave = () => {
        gsap.set(imgWrapper, {
          opacity: 0,
          xPercent: 25,
          yPercent: -50,
          scale: 0.8,
          rotation: -15,
        });
      };

      const onMouseMove = ({ x, y }) => {
        let yOffSet = itemBounds.top / imageWrapperBounds.height;
        yOffSet = gsap.utils.mapRange(0, 1.5, -150, 150, yOffSet);

        gsap.to(imgWrapper, {
          duration: 1.25,
          x: Math.abs(x - itemBounds.left) - imageWrapperBounds.width / 1.55,
          y:
            Math.abs(y - itemBounds.top) -
            imageWrapperBounds.height / 2 -
            yOffSet,
        });
      };

      item.addEventListener("mouseenter", onMouseEnter);
      item.addEventListener("mouseleave", onMouseLeave);
      item.addEventListener("mousemove", onMouseMove);
    });
  }

  init() {
    // Récupère les positions des sections
    this.data = this.sections.map(
      (section) => section.offsetTop - section.offsetHeight
    );

    // Attache les événements de clic pour un défilement fluide
    this.navLinks.forEach((navLink, index) => {
      navLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.scrollContainer.scrollTo({
          top: this.data[index],
          behavior: "smooth",
        });
      });
    });

    // Gère le scroll principal
    this.scrollContainer.addEventListener("scroll", () => this.handleScroll());
    this.handleScroll(); // Lancer une première vérification au chargement
  }

  handleScroll() {
    const trigger = this.scrollContainer.scrollTop; // Distance du top du conteneur

    for (let i = 0; i < this.data.length; i++) {
      // Vérification de la position dans les sections
      if (trigger >= this.data[i] && trigger < (this.data[i + 1] || Infinity)) {
        if (i !== this.savedIndex) {
          this.savedIndex = i;

          // Mise à jour du titre dynamique
          this.updateDynamicTitle(i);

          // Modification des classes
          this.addClassAndClear(i);
        }
        break;
      }
    }
  }

  updateDynamicTitle(index) {
    const titles = ["Presentation", "Prestations", "Contact"];
    this.dynamicTitle.textContent = titles[index] || "";
  }

  addClassAndClear(index) {
    const activeNavLink = this.navLinks.find((navLink) =>
      navLink.classList.contains("active")
    );
    if (activeNavLink) activeNavLink.classList.remove("active");
    this.navLinks[index].classList.add("active");
  }
}
