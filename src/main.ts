import Phaser from 'phaser'

// import ShittyMountainScene from './ShittyMountainScene'
import MatterMountainScene from './MatterMountainScene'
// import MyPipeline from './MyPipeline'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	parent: 'app',
	width: 960,
	height: 540,
	physics: {
        default: 'matter'
    },
	scene: [MatterMountainScene],
	// pipeline:{'MyPipeline': MyPipeline as Phaser.Renderer.WebGL.WebGLPipeline}
}

export default new Phaser.Game(config)
