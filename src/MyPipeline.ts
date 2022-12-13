const fragShader = `
precision mediump float;
uniform sampler2D uMainSampler[%count%];
uniform float uTime;
varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;
void main()
{
    vec4 texture;
    %forloop%
    gl_FragColor = texture;
    vec3 tint = vec3(outTexCoord, abs(sin(uTime / 1000.)));
    gl_FragColor.rgb *= tint;
}
`;

export default class MyPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    private time = 0;
    constructor (game: Phaser.Game)
    {
        super({
            game,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'uTime',
            ]
        });

    }

    onPreRender ()
    {
        this.set1f('uTime', this.game.loop.time);
    }


}