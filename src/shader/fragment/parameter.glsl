uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

varying vec2 vUv;
uniform vec3 color;

void main() {
  float r = abs(sin(color.x));
  float g = abs(sin(color.y));
  float b = abs(sin(color.z));
  gl_FragColor = vec4(r, g, b, 1.0);
}
