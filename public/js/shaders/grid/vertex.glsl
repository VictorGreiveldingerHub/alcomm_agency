uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform sampler2D uGlowTexture;

attribute vec3 normal;
attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
    float glowIntensity = texture2D(uGlowTexture, uv).r;
    glowIntensity = smoothstep(0.01, 0.99, glowIntensity);

    vec3 newPosition = position;
    vec3 displacement = vec3(
        0,
        0,
        1.0
    );

    displacement = normalize(displacement);
    displacement *= glowIntensity;
    displacement /= 8.0; // Voir pour régler la taille du déplacement

    newPosition += displacement;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}