import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
	constructor() {
		super('preloader')
	}

	preload() {

		var progressBar = this.add.graphics();
		var progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(240, 270, 320, 50);

		var width = this.cameras.main.width;
		var height = this.cameras.main.height;
		var loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Loading...',
			style: {
				font: '20px monospace',
				color: '#ffffff'
			}
		});
		loadingText.setOrigin(0.5, 0.5);

		var percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: '0%',
			style: {
				font: '18px monospace',
				color: '#ffffff'
			}
		});
		percentText.setOrigin(0.5, 0.5);

		var assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 50,
			text: '',
			style: {
				font: '18px monospace',
				color: '#ffffff'
			}
		});
		assetText.setOrigin(0.5, 0.5);

		this.load.on('progress', function (value) {
			percentText.setText(parseInt(value * 100) + '%');
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(250, 280, 300 * value, 30);
		});

		this.load.on('fileprogress', function (file) {
			assetText.setText('Loading asset: ' + file.key);
		});

		this.load.on('complete', function () {
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			assetText.destroy();
		});

		this.load.image('joystickImg', 'Others/joystick.png');
		this.load.image('tiles', 'tiles/ice_tileset.png');
		this.load.image('tilesTrees', 'tiles/tree.png');
		this.load.image('tilesStones', 'tiles/stone.png');
		this.load.tilemapTiledJSON('dungeon-1', 'tiles/dungeon-show_1.json');
		this.load.tilemapTiledJSON('dungeon-2', 'tiles/dungeon-show_2.json');
		this.load.tilemapTiledJSON('dungeon-3', 'tiles/dungeon-show_3.json');
		this.load.tilemapTiledJSON('dungeon-4', 'tiles/dungeon-show_4.json');
		this.load.tilemapTiledJSON('dungeon-5', 'tiles/dungeon-show_5.json');

		this.load.atlas('hero', 'character/hero2.png', 'character/hero2.json');
		this.load.atlas('slime', 'enemies/slime.png', 'enemies/slime.json');

		this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json');
		this.load.atlas('gift', 'Others/gift_0.png', 'Others/gift_0.json');

		this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png');
		this.load.image('ui-heart-full', 'ui/ui_heart_full.png');

		this.load.image('snowBall', 'weapons/snowball_0.png');
		this.load.image('pauseButton', 'Others/pause_button.png');
		this.load.image('startButton', 'Others/start_button.png');
		this.load.image('quitButton', 'Others/quit_button.png');
		this.load.image('background', 'bg/7976081_resized.jpg');
		this.load.plugin('rexvirtualjoystickplugin', 'plugins/rexvirtualjoystickplugin.min.js', true);

		this.load.audio("bg_music", ["music/bg_small.mp3"]);
		this.load.audio("open_chest", ["music/open_chest.wav"]);
		this.load.audio("game_over", ["music/Game_Over_1.wav"]);
		this.load.audio("throw_snowball", ["music/throw_snowball.wav"]);
		this.load.audio("hit_slime", ["music/to_slime.wav"]);
		this.load.audio("hero_hit", ["music/to_slime_2.wav"]);
		this.load.audio("final_level", ["music/Fanfare_2.wav"]);
		this.load.audio("final_game", ["music/Fanfare_1.wav"]);
		this.load.audio("button_click", ["music/button_click.mp3"]);

		this.load.image('pic', 'Others/spaceship.png');
	}

	create() {
		/* if (this.scale.orientation.toString() == "landscape-primary") {
			this.scene.start('menu');
		} else {
			//handle your portrait case
		} */

		this.text = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height / 2, 'Please set your\nphone to landscape', { font: '48px Courier', color: '#00ff00', align: 'center' }).setOrigin(0.5);

		this.checkOriention(this.scale.orientation);

		this.scale.on('orientationchange', this.checkOriention, this);
	}

	checkOriention(orientation) {
		if (orientation === Phaser.Scale.PORTRAIT) {
			this.text.setVisible(true);
		}
		else if (orientation === Phaser.Scale.LANDSCAPE) {
			this.text.setVisible(false);
			this.scene.start('menu');
		}
	}
}