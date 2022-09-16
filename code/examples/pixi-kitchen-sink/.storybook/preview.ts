import { ApplicationResizeFunctionReturnType } from '@storybook/pixi/src/types';
// This decorator would be custom written/have functionality imported from your game if
// necessary, how you resize/fit/scale and combine with the gameResize function ultimately
// depends on your use case.
//
// This gameResize function and decorator mimics how Kaito Message works
import { makeFitToStageDecorator } from './decorators/fitToStageDecorator';

// This config and gameResize function would be imported from your game's code
const LOGICAL_WIDTH = 720;
const LOGICAL_HEIGHT = 1280;

function gameResize(logicalWidth: number, logicalHeight: number) {
  return (w: number, h: number): ApplicationResizeFunctionReturnType => {
    if (w > h) {
      const ratioW = w / logicalWidth;
      const ratioH = logicalHeight / h;
      return {
        rendererWidth: Math.round(Math.floor(logicalWidth * ratioW * ratioH)),
        rendererHeight: logicalHeight,
        canvasWidth: w,
        canvasHeight: h,
      };
    }
    const ratioW = logicalWidth / w;
    const ratioH = h / logicalHeight;
    return {
      rendererWidth: logicalWidth,
      rendererHeight: Math.round(Math.floor(logicalHeight * ratioH * ratioW)),
      canvasWidth: w,
      canvasHeight: h,
    };
  };
}

export const parameters = {
  layout: 'fullscreen',
  pixi: {
    applicationOptions: {
      backgroundColor: 0x1099bb,
      resolution: 1,
    },
    resizeFn: gameResize(LOGICAL_WIDTH, LOGICAL_HEIGHT),
  },
};

export const decorators = [makeFitToStageDecorator(LOGICAL_WIDTH, LOGICAL_HEIGHT)];
