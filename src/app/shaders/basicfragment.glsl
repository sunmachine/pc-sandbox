precision highp float;

varying vec2 uv0;
uniform float time;

void main(void)
{
    vec4 color = vec4(uv0.x, uv0.y, time * (uv0.r + uv0.g), 1.0);
    gl_FragColor = color;
}
