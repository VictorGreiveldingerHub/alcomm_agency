attribute vec3 initialPosition;
uniform vec3 mousePosition;
uniform float time;
uniform float dispersionLimit;
uniform float size;


void main() {
    vec3 newPosition = position;
    vec3 direction = mousePosition - position;
    float distance = length(direction);
    float force = 0.001 / (distance * distance);

    if (distance < dispersionLimit) {
        if (mod(float(gl_VertexID), 5.0) == 0.0) {
            newPosition -= force * normalize(direction);
        } else {
            newPosition += force * normalize(direction);
        }
    }

    // Ease back to original position
    newPosition += (initialPosition - newPosition) * force;

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = size;
}