uniform sampler2D pointTexture;
uniform vec3 color;

void main() {

    vec4 textureColor = texture2D(pointTexture, gl_PointCoord); // Récupère la couleur de la texture
    gl_FragColor = vec4(textureColor.rgb * color, textureColor.a); // Applique la teinte et conserve l'alpha
}