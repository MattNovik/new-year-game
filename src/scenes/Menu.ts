import Phaser from 'phaser'

export default class Menu extends Phaser.Scene {
  constructor() {
    super('menu')
  }

  preload() {
    this.load.html('emailform', 'form/emailForm.html');
  }

  create() {
    const cameraWidth = this.cameras.main.width;
    const cameraHeight = this.cameras.main.height;
    const imageBG = this.add.image(0, 0, 'background').setOrigin(0, 0.2);
    imageBG.setScale(Math.max(cameraWidth / imageBG.width, cameraHeight / imageBG.height));

    let rt = this.add.renderTexture(0, 0, cameraWidth * 2, cameraHeight * 2);
    rt.fill(0x000000, 0.5);

    const element = this.add.dom(cameraWidth / 2, cameraHeight / 2).createFromCache('emailform').setOrigin(0.5);

    element.addListener('click');
    element.setDepth(1);

    element.on('click', (event: any) => {

      if (event.target.name === 'playButton') {
        const inputText = element.getChildByName('nameField');

        //  Have they entered anything?
        if (inputText.value !== '') {
          //  Turn off the click events
          element.removeListener('click');

          //  Hide the login element
          element.setVisible(false);
          this.resumeGame();

        }
        else {

        }
      }
    });
  }

  resumeGame() {
    this.scene.start('game');
  }
}