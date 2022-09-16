import { Container, Sprite, Texture } from 'pixi.js';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Demos-Basic',
  args: {
    bunnySize: 5,
    bunnySpacing: 40,
    someInjectedObject: {
      onBunnyClick: action('onBunnyClick'),
    },
  },
};

export const Default = ({ bunnySize, bunnySpacing, someInjectedObject }) => {
  const container = new Container();

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
    container.addChild(bunny);
  }

  // Center bunny sprite in local container coordinates
  container.pivot.x = container.width / 2;
  container.pivot.y = container.width / 2;
  container.x = 720 / 2;
  container.y = 1280 / 2;

  return {
    view: container,
    update: (delta) => {
      container.rotation -= 0.01 * delta;
    },
    destroy: () => {
      container.destroy(true);
    },
  };
};
