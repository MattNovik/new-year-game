import Phaser from 'phaser'
import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import GameUI from './scenes/GameUI'
import Menu from './scenes/Menu'

const game = new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth * window.devicePixelRatio,
	height: window.innerHeight * window.devicePixelRatio,
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
		mode: Phaser.Scale.ScaleModes.FIT,
		parent: 'phaser-id',
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: window.innerWidth * window.devicePixelRatio,
		height: window.innerHeight * window.devicePixelRatio,
	},
	input: {
    activePointers: 3, // 2 is default for mouse + pointer, +1 is required for dual touch
  },
})

window.addEventListener('load', () => {
	window.addEventListener('resize', event => {
		game.scene.scenes[2].resizeGameContainer();
		/* for (let i = 0; i < game.scene.scenes.length; i++) {
			game.scene.scenes[i].resizeGameContainer();
		} */
	});
});

export default game;