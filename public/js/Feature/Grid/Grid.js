import {
  Mesh,
  PlaneGeometry,
  RawShaderMaterial,
  Uniform,
  Raycaster,
  Vector2,
  MeshBasicMaterial,
  Color,
  CanvasTexture,
} from "three";

import EventEmitter from "../Utils/EventEmitter.js";
import Playground from "../Utils/Playground.js";

import gridFragmentShader from "../../shaders/grid/fragment.glsl";
import gridVertexShader from "../../shaders/grid/vertex.glsl";

export default class Grid extends EventEmitter {
  constructor(feature) {
    super();

    this.feature = feature;
    this.scene = this.feature.scene;
    this.camera = this.feature.camera;
    this.renderer = this.feature.renderer;
    this.ressources = this.feature.resources;
    this.fov_y = this.setFovY();

    const cursor = document.getElementById("cursor-circle");
    console.log(cursor.style);

    this.glowEffect = new Playground(
      100,
      100,
      "/image/glow.png",
      new Vector2(9999, 9999),
      new Vector2(9999, 9999),
      new Vector2(9999, 9999)
    );

    this.glowEffect.raycaster = new Raycaster();

    this.glowEffect.texture = new CanvasTexture(this.glowEffect.canvas);
    this.initGlowMesh();
    this.setInteractivePlan();

    window.addEventListener("pointermove", (event) => {
      this.glowEffect.screenCursor.x =
        (event.clientX / this.feature.sizes.width) * 2 - 1;
      this.glowEffect.screenCursor.y =
        -(event.clientY / this.feature.sizes.height) * 2 + 1;

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      this.trigger("pointermove");
    });
  }

  initGlowMesh() {
    this.mesh = new Mesh(
      new PlaneGeometry(
        this.fov_y * this.feature.camera.instance.aspect,
        this.fov_y,
        100,
        100
      ),
      new RawShaderMaterial({
        vertexShader: gridVertexShader,
        fragmentShader: gridFragmentShader,
        uniforms: {
          uRows: { value: 15.0 },
          uColumns: { value: 10.0 },
          uGlowTexture: new Uniform(this.glowEffect.texture),
          uTime: { value: 0.0 },
          uBackgroundColor: { value: new Color(0x684d44) },
        },
      })
    );

    this.scene.add(this.mesh);
  }

  setInteractivePlan() {
    this.glowEffect.interactivePlan = new Mesh(
      new PlaneGeometry(
        this.fov_y * this.feature.camera.instance.aspect,
        this.fov_y
      ), // Même valeur que pour la geometrie "principale"
      new MeshBasicMaterial({
        visible: false,
        wireframe: false,
        color: new Color(0xff0000),
      })
    );
    this.glowEffect.interactivePlan.position.z = 0.001; // Juste pour mettre devant l'autre géométrie

    this.scene.add(this.glowEffect.interactivePlan);
  }

  resize() {
    this.fov_y = this.setFovY();
    this.mesh.geometry.dispose();
    this.mesh.geometry = new PlaneGeometry(
      this.fov_y * this.feature.camera.instance.aspect,
      this.fov_y,
      100,
      100
    );
    this.glowEffect.interactivePlan.geometry.dispose();
    this.glowEffect.interactivePlan.geometry = new PlaneGeometry(
      this.fov_y * this.feature.camera.instance.aspect,
      this.fov_y
    );
  }

  update() {
    this.mesh.material.uniforms.uTime.value = this.feature.time.elapsed * 0.001;

    this.setRaycaster();

    this.glowEffect.setContext();

    this.glowEffect.texture.needsUpdate = true;
  }

  setRaycaster() {
    this.glowEffect.raycaster.setFromCamera(
      this.glowEffect.screenCursor,
      this.feature.camera.instance
    );

    const intersections = this.glowEffect.raycaster.intersectObject(
      this.glowEffect.interactivePlan
    );

    if (intersections.length) {
      const uv = intersections[0].uv;

      this.glowEffect.canvasCursor.x = uv.x * this.glowEffect.canvas.width;
      this.glowEffect.canvasCursor.y =
        (1 - uv.y) * this.glowEffect.canvas.height;
    }
  }

  setFovY() {
    let ang_rad = (this.feature.camera.instance.fov * Math.PI) / 180;
    return this.feature.camera.instance.position.z * Math.tan(ang_rad / 2) * 2;
  }
}
