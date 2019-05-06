// attribute vec2 uv;
// attribute vec3 position;
// attribute mat4 projectionMatrix;
// attribute mat4 modelViewMatrix;

varying mat4 mMatrix;
varying mat4 vMatrix;
varying mat4 pMatrix;
varying mat4 mvpMatrix;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  pMatrix = projectionMatrix;
  mMatrix = modelViewMatrix;
  mvpMatrix = pMatrix * mMatrix;
  vPosition = (mMatrix * vec4(position, 1)).xyz;
  vNormal = normalize((mMatrix * vec4(normal, 0.0)).xyz);
  //   vColor = color;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1);
  gl_Position = projectionMatrix * mvPosition;
}
