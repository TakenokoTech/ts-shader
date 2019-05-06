precision mediump float;

// uniform vec3 eyePosition;
// uniform samplerCube cubeTexture;
// uniform bool refraction;
// uniform float eta;
uniform samplerCube cubeTexture;
uniform sampler2D texture;
uniform vec3 color;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main(void) {
  vec3 ref;
  // if (refraction) {
  vec3 eyePosition = color * vec3(10000);
  float eta = 0.5;
  ref = refract(normalize(vPosition - eyePosition), vNormal, eta);
  // } else {
  // ref = vNormal;
  // }
  vec4 envColor = textureCube(cubeTexture, ref);
  // vec4 destColor = vColor * envColor;
  gl_FragColor = envColor;
}
