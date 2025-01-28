import { PerspectiveCamera } from "three";

export default class Camera {
  constructor(feature, fov, position) {
    this.feature = feature;
    this.fov = fov;
    this.position = position;

    this.sizes = this.feature.sizes;
    this.scene = this.feature.scene;

    this.setInstance();
  }

  setInstance() {
    // Voir pour changer les paramètres de la caméra
    this.instance = new PerspectiveCamera(
      this.fov,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(0, 0, this.position);
    this.scene.add(this.instance);
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
}
