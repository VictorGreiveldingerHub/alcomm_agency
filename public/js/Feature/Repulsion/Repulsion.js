import {
  Mesh,
  MeshBasicMaterial,
  ShapeGeometry,
  Vector3,
  BufferGeometry,
  ShaderMaterial,
  Points,
  Color,
  Raycaster,
  Vector2,
} from "three";

import repulsionVertexShader from "../../shaders/repulsion/vertex.glsl";
import repulsionFragmentShader from "../../shaders/repulsion/fragment.glsl";

export default class Repulsion {
  constructor(feature) {
    this.feature = feature;
    this.canvas = this.feature.canvas;
    this.scene = this.feature.scene;
    this.camera = this.feature.camera.instance;
    this.resources = this.feature.resources;
    this.time = this.feature.time;

    // Initialisation des variables
    this.raycaster = new Raycaster();
    this.mouse = new Vector2(9999, 9999);
    this.xMid = 0;
    this.yMid = 0;
    this.particles = null;
    this.mParticles = null;
    this.initialPositions = null;
    this.colorChange = new Color();
    this.ease = 0.05;

    // Chargement des ressources
    this.resources.on("ready", () => {
      this.font = this.resources.items["helvetiker"];
      this.particleTexture = this.resources.items["repulsionTexture"];

      this.initText();
    });

    // Logique de la souris
    document.addEventListener("mousemove", (event) => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();

      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });
  }

  initText() {
    let text; // Voir pour modifier / améliorer ça
    switch (this.feature.type) {
      case "PHOTOGRAPHE":
        text = "PHOTOGRAPHE";
        break;
      case "GRAPHISTE":
        text = "GRAPHISTE";
        break;
      case "ALCOMM' AGENCY":
        text = "COMMUNITY MANAGER";
        break;
      case "NUMBER":
        text = "0.0";
        break;
      default:
        text = "Erreur";
    }

    if (!this.canvas) return;
    const textSize = (this.canvas.clientWidth / text.length) * 0.03; // Voir pour récuperer la taille de la div plutot que l'ecran

    // Générer les formes à partir du texte
    const shapes = this.generateShapesFromText(this.font, text, textSize);

    // Créer la géométrie du texte
    const textGeometry = this.initTextGeometry(shapes);

    const textMaterial = new MeshBasicMaterial({
      color: 0xf5ebe0,
    });

    const textMesh = new Mesh(textGeometry, textMaterial);
    this.scene.add(textMesh);

    // Créer la géométrie des particules
    const geoParticles = this.createParticlesGeometry(shapes);
    // Stocker les positions initiales des particules
    this.initialPositions = geoParticles.attributes.position.array.slice();
    // Créer le matériau des particules
    this.mParticles = this.createParticlesMaterial();

    // Créer et ajouter les particules à la scène
    this.particles = new Points(geoParticles, this.mParticles);

    this.particles.position.x = this.xMid;
    this.particles.position.y = this.yMid;

    this.scene.add(this.particles);
  }

  generateShapesFromText(font, text, textSize) {
    return font.generateShapes(text, textSize);
  }

  initTextGeometry(shapes) {
    const textGeometry = new ShapeGeometry(shapes);

    // Calcul des décalages pour centrer la géométrie
    textGeometry.computeBoundingBox();
    this.xMid =
      -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
    this.yMid =
      -0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);

    // Centrage de la géométrie
    textGeometry.translate(this.xMid, this.yMid, 0);

    return textGeometry;
  }

  createParticlesGeometry(shapes) {
    const particlePoints = [];
    const particlesNbr = 2000;

    shapes.forEach((shape) => {
      const points = shape.getSpacedPoints(particlesNbr);
      points.forEach((point) => {
        particlePoints.push(new Vector3(point.x, point.y, 0));
      });

      if (shape.holes && shape.holes.length > 0) {
        shape.holes.forEach((hole) => {
          const holePoints = hole.getSpacedPoints(particlesNbr);
          holePoints.forEach((point) => {
            particlePoints.push(new Vector3(point.x, point.y, 0));
          });
        });
      }
    });

    const geoParticles = new BufferGeometry().setFromPoints(particlePoints);

    return geoParticles;
  }

  createParticlesMaterial() {
    return new ShaderMaterial({
      vertexShader: repulsionVertexShader,
      fragmentShader: repulsionFragmentShader,
      uniforms: {
        color: { value: new Color(0xffffff) },
        pointTexture: { value: this.particleTexture },
        size: { value: 0.5 },
      },
      depthWrite: false,
      alphaTest: 0.001,
      transparent: true,
      depthTest: false,
    });
  }

  resize() {
    this.scene.remove(this.particles);
    this.initText();
  }

  update() {
    this.raycaster.setFromCamera(this.mouse, this.feature.camera.instance);

    // Calculer les intersections
    if (this.particles) {
      const intersects = this.raycaster.intersectObject(this.particles);

      if (intersects.length > 0) {
        const intersect = intersects[0];

        // Récupération des positions des particules
        const particlePositions = this.particles.geometry.attributes.position;

        const mx = intersect.point.x - this.xMid;
        const my = intersect.point.y - this.yMid;

        for (let i = 0, l = particlePositions.count; i < l; i++) {
          const initX = this.initialPositions[i * 3];
          const initY = this.initialPositions[i * 3 + 1];

          let px = particlePositions.getX(i);
          let py = particlePositions.getY(i);

          let dx = mx - px;
          let dy = my - py;

          const mouseDistance = Math.hypot(dx + dy);
          const d = dx * dx * 1.1 + dy * dy * 1.1;
          const f = -2 / d;

          if (mouseDistance < 10) {
            if (i % 2 === 0) {
              // Calcul de l'angle entre la particule et la souris
              const t = Math.atan2(dy, dx);

              px -= 0.01 * Math.cos(t);
              py -= 0.01 * Math.sin(t);
            } else {
              const t = Math.atan2(dy, dx);

              px += f * Math.cos(t);
              py += f * Math.sin(t);

              particlePositions.setXYZ(i, px, py, 0);
              particlePositions.needsUpdate = true;
            }
          }

          px += (initX - px) * this.ease;
          py += (initY - py) * this.ease;

          particlePositions.setXYZ(i, px, py, 0);
          particlePositions.needsUpdate = true;
        }
      } else {
        // Restaurer les positions initiales des particules avec easing
        const particlePositions = this.particles.geometry.attributes.position;

        for (let i = 0; i < particlePositions.count; i++) {
          const initX = this.initialPositions[i * 3]; // x
          const initY = this.initialPositions[i * 3 + 1]; // y

          let px = particlePositions.getX(i);
          let py = particlePositions.getY(i);

          px += (initX - px) * this.ease;
          py += (initY - py) * this.ease;

          particlePositions.setXYZ(i, px, py, 0);
          particlePositions.needsUpdate = true;
        }
      }
    }
  }
}
