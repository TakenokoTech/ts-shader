precision mediump float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float random(vec2 st) {
  float r = sin(dot(st.xy, vec2(15, 75)) + u_time);
  return fract(r * 50000.0);
}

void main(void) {
  vec2 st = fract((gl_FragCoord.xy + vec2(u_time * 0.001)) / u_resolution);
  gl_FragColor = vec4(vec3(random(st)), 1.);
}
