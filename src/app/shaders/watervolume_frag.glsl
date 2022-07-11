precision highp float;

varying vec2 uv0;
uniform float time;

void main(void)
{
    vec4 color = vec4(uv0.x, uv0.y, 1.0 - time * (uv0.r + uv0.g), 0.5);
    gl_FragColor = color;
}
