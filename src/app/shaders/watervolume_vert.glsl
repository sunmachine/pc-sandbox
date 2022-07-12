precision highp float;

attribute vec3 a_position;
attribute vec2 a_uv0;

uniform mat4 matrix_model;
uniform mat4 matrix_viewProjection;

varying vec3 local_position;
varying vec2 uv0;

void main(void)
{
    uv0 = a_uv0;
    local_position = a_position; 
    gl_Position = matrix_viewProjection * matrix_model * vec4(a_position, 1.0);
}