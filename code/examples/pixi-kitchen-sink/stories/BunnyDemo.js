import { Container, Sprite, Texture } from 'pixi.js';

export class BunnyDemo {
  constructor({ bunnySize, bunnySpacing, someInjectedObject }) {
    this.view = new Container();

    // Create a new texture
    const texture = Texture.from('bunny.png');
    const numBunnies = bunnySize * bunnySize;

    for (let i = 0; i < numBunnies; i += 1) {
      const bunny = new Sprite(texture);
      bunny.buttonMode = true;
      bunny.interactive = true;
      bunny.on('pointerdown', someInjectedObject.onBunnyClick);
      bunny.x = (i % bunnySize) * bunnySpacing;
      bunny.y = Math.floor(i / bunnySize) * bunnySpacing;
      this.view.addChild(bunny);
    }

    // Center bunny sprite in local container coordinates
    this.view.pivot.x = this.view.width / 2;
    this.view.pivot.y = this.view.height / 2;
    this.view.x = 720 / 2;
    this.view.y = 1280 / 2;

    this.view.rotation = Math.PI / 4;
  }

  update(delta) {
    this.view.rotation -= 0.01 * delta;
  }

  destroy() {
    this.view.destroy(true);
  }
}
