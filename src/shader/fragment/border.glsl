precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(void) {
  float x = abs(sin(gl_FragCoord.x * .1));
  float y = abs(sin(u_time * .1));
  float z = u_mouse.x / u_resolution.x;
  gl_FragColor = vec4(x, y, z, 1.);
}
