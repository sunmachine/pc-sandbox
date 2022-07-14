precision highp float;

const vec2 u_repeat = vec2(2.0, 2.0); 
uniform float time;

varying vec3 local_position;
varying vec2 uv0;

void main(void)
{
    float d = (local_position.y + 0.5) / 2.0;
    d *= d;
    float v = mod(dot(vec2(1.0), step(vec2(0.5), fract(uv0 * u_repeat))), 2.0) * d;
    vec4 color = vec4(v, v, v, 1.0 - d);

    gl_FragColor = color;
}
