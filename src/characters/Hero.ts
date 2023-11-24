import Phaser from "phaser";
import Chest from "~/items/Chest";

import { sceneEvents } from '../events/EventsCenter'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      hero(x: number, y: number, texture: string, frame?: string | number): Hero
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

export default class Hero extends Phaser.Physics.Arcade.Sprite {

  private healthState = HealthState.IDLE;
  private damageTime = 0;

  private _health = 2;

  private snowBalls?: Phaser.Physics.Arcade.Group

  private activeChest?: Chest;

  get health() {
    return this._health;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.anims.play('hero-idle-bottom');
  }

  setSnowBalls(snowBalls: Phaser.Physics.Arcade.Group) {
    this.snowBalls = snowBalls;
  }

  setChests(chest: Chest) {
    this.activeChest = chest;
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return;
    }

    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    --this._health;

    if (this._health <= 0) {
      //die
      this.healthState = HealthState.DEAD;
      this.anims.play('hero-dead-down');
      this.setVelocity(0, 0);
      this.setRotation(110);
    } else {
      this.setVelocity(dir.x, dir.y);
      this.setTint(0xff0000);
      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  private throwSnowBall() {

    if (!this.snowBalls || !this.snowBalls.children) {
      return;
    }

    const snowBall = this.snowBalls.get(this.x, this.y, 'snowBall') as Phaser.Physics.Arcade.Image;

    if (!snowBall) {
      return;
    }

    const parts = this.anims.currentAnim?.key.split('-');
    const direction = parts![2];

    const vec = new Phaser.Math.Vector2(0, 0);
    switch (direction) {
      case 'up':
        vec.y = -1;
        break;
      case 'bottom':
        vec.y = 1;
        break;
      default:
      case 'left' || 'right':
        if (direction === 'left') {
          vec.x = -1;
        } else {
          vec.x = 1;
        }
        break;
    }

    const angle = vec.angle();

    sceneEvents.emit('hero-shoot');
    snowBall.setActive(true);
    snowBall.setVisible(true);

    snowBall.setRotation(angle);

    snowBall.x += vec.x * 16;
    snowBall.y += vec.y * 16;
    snowBall.setVelocity(vec.x * 300, vec.y * 300);

    setTimeout(() => {
      if (snowBall) {
        snowBall.destroy();
      }
    }, 2000)
  }

  shootOnMobile() {
    if (this.activeChest) {
      const coins = this.activeChest.open();

      sceneEvents.emit('player-coins-changed', coins);
      this.activeChest = undefined;
    } else {
      this.throwSnowBall();
    }
  }

  preUpdate(t: number, dt: number) {
    this?.body?.setSize(this.width * 0.6, this.height * 0.6);
    super.preUpdate(t, dt);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += dt;
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined, movementJoyStick: any) {

    if (this.healthState === HealthState.DAMAGE || this.healthState === HealthState.DEAD) {
      return;
    }

    if (movementJoyStick && movementJoyStick.base) {
      if (movementJoyStick?.force) {
        // Calculate speed based on joystick force
        let speedMultiplier = (movementJoyStick.force < movementJoyStick.radius) ? movementJoyStick.force / movementJoyStick.radius : 1
        let speed = 100 * speedMultiplier;

        const leftKeyDown = movementJoyStick.left;
        const rightKeyDown = movementJoyStick.right;
        const upKeyDown = movementJoyStick.up;
        const downKeyDown = movementJoyStick.down;
        const noKeyDown = movementJoyStick.noKey;

        if (leftKeyDown) {
          this.anims.play('hero-run-left', true);
          this.setVelocity(-speed, 0);
        } else if (rightKeyDown) {
          this.anims.play('hero-run-right', true);
          this.setVelocity(speed, 0);
        } else if (upKeyDown) {
          this.anims.play('hero-run-up', true);
          this.setVelocity(0, -speed);
        } else if (downKeyDown) {
          this.anims.play('hero-run-bottom', true);
          this.setVelocity(0, speed);
        }

        /*         if (leftKeyDown || rightKeyDown || upKeyDown || downKeyDown) {
                  this.activeChest = undefined;
                } */
      } else {
        // Stop moving
        const parts = this.anims.currentAnim.key.split('-');
        if (parts) {
          parts[1] = 'idle'
          this.anims.play(parts.join('-'));
        }
        this.setVelocityX(0)
        this.setVelocityY(0)
      };
    } else {
      if (!cursors) {
        return;
      }

      if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
        if (this.activeChest) {
          const coins = this.activeChest.open();

          sceneEvents.emit('player-coins-changed', coins);
          this.activeChest = undefined;
        } else {
          this.throwSnowBall();
        }

        return;
      }

      const speed = 100;

      const leftDown = cursors.left?.isDown;
      const rightDown = cursors.right?.isDown;
      const upDown = cursors.up?.isDown;
      const downDown = cursors.down?.isDown;

      if (this.anims && this.anims.currentAnim) {
        if (leftDown) {
          this.anims.play('hero-run-left', true);
          this.setVelocity(-speed, 0);
        } else if (rightDown) {
          this.anims.play('hero-run-right', true);
          this.setVelocity(speed, 0);
        } else if (upDown) {
          this.anims.play('hero-run-up', true);
          this.setVelocity(0, -speed);
        } else if (downDown) {
          this.anims.play('hero-run-bottom', true);
          this.setVelocity(0, speed);
        } else {
          const parts = this.anims.currentAnim.key.split('-');
          if (parts) {
            parts[1] = 'idle'
            this.anims.play(parts.join('-'));
            this.setVelocity(0, 0)
          }
        }

      }
      /*       if (leftDown || rightDown || upDown || downDown) {
              this.activeChest = undefined;
            } */
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('hero', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  let sprite = new Hero(this.scene, x, y, texture, frame);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

  return sprite;
})