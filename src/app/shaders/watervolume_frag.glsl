precision highp float;

varying vec2 uv0;
uniform float time;

const vec2 u_repeat = vec2(2, 2); 

void main(void)
{

    float v = mod(dot(vec2(1.0), step(vec2(0.5), fract(uv0 * u_repeat))), 2.0);
    vec4 color = vec4(v, v, v, 0.5);

    gl_FragColor = color;
}
