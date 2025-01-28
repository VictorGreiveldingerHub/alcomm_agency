precision highp float;

uniform float uRows;
uniform float uColumns;
uniform float uTime;
uniform vec3 uBackgroundColor;

varying vec2 vUv;

// Fonction pseudo-aléatoire
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(1000, 500))));
}

void main() {

  float pointStrength = 0.0;
  float pointInterval = 1.2; // Intervalle entre les points lumineux

  float randValue = random(vUv + (uTime * 0.01)) * pointInterval;
  float modX = mod(vUv.x * uRows + randValue, pointInterval);
  float modY = mod(vUv.y * uColumns + randValue, pointInterval);

  pointStrength += smoothstep(0.95, 0.99, modX) * step(0.99, mod(vUv.y * uColumns, 1.0));
  pointStrength += smoothstep(0.95, 0.99, modY) * step(0.99, mod(vUv.x * uRows, 1.0));

  // Définir la couleur des points lumineux
  vec3 pointColor = vec3(vUv, 1.0); // Couleur blanche par défaut
 
  pointColor = vec3(61.0 / 255.0, 189.0 / 255.0, 162.0 / 255.0);
    
  // Combiner la grille et les points lumineux
  vec3 finalColor = mix(uBackgroundColor, pointColor, pointStrength);

  gl_FragColor = vec4(finalColor, 1.0);
}
