// attribute vec3 position;
// varying mat4 modelViewMatrix;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1);
  gl_Position = projectionMatrix * mvPosition;
}
