import { Container } from 'pixi.js';
import { StoryFnPixiReturnType } from '@storybook/pixi/src/types';

export const makeFitToStageDecorator =
  (appWidth: number, appHeight: number) =>
  (story): StoryFnPixiReturnType => {
    const root = new Container();
    const storyResult = story();

    root.addChild(storyResult.view);

    return {
      view: root,
      update: storyResult.update,
      resize: (screenWidth, screenHeight) => {
        const appAspect = appWidth / appHeight;
        const screenAspect = screenWidth / screenHeight;

        if (appAspect > screenAspect) {
          root.scale.set(screenWidth / appWidth);
        } else {
          root.scale.set(screenHeight / appHeight);
        }

        root.x = (screenWidth - appWidth * root.scale.x) / 2;
        root.y = (screenHeight - appHeight * root.scale.y) / 2;

        // Maybe not necessary as with this particular case we're rendering everything to a
        // logical fixed width and height
        storyResult.resize?.(screenWidth, screenHeight);
      },
      destroy: storyResult.destroy,
    };
  };
