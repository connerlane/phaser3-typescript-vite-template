// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
varying vec2 fragCoord;
void main() {
    vec2 st = fragCoord/resolution.xy;
    vec3 color = vec3(st.xy, abs(sin(time)));
    gl_FragColor = vec4(color, 1.);
}
