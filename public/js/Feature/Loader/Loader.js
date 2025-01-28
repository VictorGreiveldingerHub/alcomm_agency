import { PlaneGeometry, Mesh, ShaderMaterial } from "three";
import loaderFragmentShader from "../../shaders/loader/fragment.glsl";
import loaderVertexShader from "../../shaders/loader/vertex.glsl";
import { gsap } from "gsap";

export default class Loader {
  constructor(feature) {
    this.feature = feature;
    this.resources = feature.resources;
    this.scene = feature.scene;

    this.overlayGeometry = new PlaneGeometry(2, 2, 1, 1);
    this.overlayMaterial = new ShaderMaterial({
      vertexShader: loaderVertexShader,
      fragmentShader: loaderFragmentShader,
      uniforms: {
        uAlpha: { value: 1 },
      },
    });

    // this.setSceneLoader();
  }

  setSceneLoader() {
    gsap.to(this.overlayMaterial.uniforms.uAlpha, { duration: 10, value: 0 });
    const overlay = new Mesh(this.overlayGeometry, this.overlayMaterial);

    this.scene.add(overlay);
  }
}
