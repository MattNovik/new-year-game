import Phaser from 'phaser';

enum Direction {
  UP, DOWN, LEFT, RIGHT
}

const randomDirection = (exlude: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3);

  while (newDirection === exlude) {
    newDirection = - Phaser.Math.Between(0, 3);
  }

  return newDirection;
};

export default class Slime extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.UP;
  private moveEvent: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.anims.play('slime-idle');

    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handlTielCollision, this);

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true
    })
  }

  destroy(fromScene?: boolean | undefined): void {
    this.moveEvent.destroy();
    super.destroy(fromScene);
  }

  private handlTielCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
    if (go !== this) {
      return;
    }
 
    this.direction = randomDirection(this.direction);
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);
    this?.body?.setSize(this.width * 0.5, this.height * 0.5);
    const speed = 50;

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -speed);
        break;

      case Direction.DOWN:
        this.setVelocity(0, speed);
        break;

      case Direction.LEFT:
        this.setVelocity(-speed, 0);
        break;

      case Direction.RIGHT:
        this.setVelocity(speed, 0);
        break;
    }

  }
}