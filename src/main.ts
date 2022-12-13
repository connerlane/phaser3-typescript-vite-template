import Phaser from 'phaser'

import MountainScene from './MountainScene'
import MyPipeline from './MyPipeline'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	parent: 'app',
	width: 960,
	height: 540,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},
	scene: [MountainScene],
	// pipeline:{'MyPipeline': MyPipeline as Phaser.Renderer.WebGL.WebGLPipeline}
}

export default new Phaser.Game(config)
