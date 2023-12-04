import Phaser from 'phaser'
import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import GameUI from './scenes/GameUI'
import Menu from './scenes/Menu'

const game = new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth / window.devicePixelRatio,
	height: window.innerHeight / window.devicePixelRatio,
	dom: {
		createContainer: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scene: [Preloader, Menu, Game, GameUI],
	scale: {
		mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
		parent: 'phaser-id',
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 800,
		height: 400,
	},
	input: {
		activePointers: 3, // 2 is default for mouse + pointer, +1 is required for dual touch
	},
});

export default game;