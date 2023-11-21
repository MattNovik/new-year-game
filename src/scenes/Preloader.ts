import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
	constructor() {
		super('preloader')
	}

	preload() {
		this.load.image('tiles', 'tiles/ice_tileset.png');
		this.load.image('tilesTrees', 'tiles/tree.png');
		this.load.image('tilesStones', 'tiles/stone.png');
		this.load.tilemapTiledJSON('dungeon', 'tiles/dungeon-show_1.json')
		this.load.tilemapTiledJSON('dungeon-2', 'tiles/dungeon-show_2.json')

		this.load.atlas('hero', 'character/hero2.png', 'character/hero2.json')
		this.load.atlas('slime', 'enemies/slime.png', 'enemies/slime.json')

		this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json')
		this.load.atlas('gift', 'Others/gift_0.png', 'Others/gift_0.json')

		this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png')
		this.load.image('ui-heart-full', 'ui/ui_heart_full.png')

		this.load.image('snowBall', 'weapons/snowball_0.png')
	}

	create() {
		this.scene.start('game');
	}
}