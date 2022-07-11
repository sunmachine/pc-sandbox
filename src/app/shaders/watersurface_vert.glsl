precision highp float;

attribute vec3 a_position;
attribute vec2 a_uv0;

uniform mat4 matrix_model;
uniform mat4 matrix_viewProjection;

varying vec2 uv0;

void main(void)
{
    uv0 = a_uv0;
    gl_Position = matrix_viewProjection * matrix_model * vec4(a_position + 0.5, 1.0) ;
}