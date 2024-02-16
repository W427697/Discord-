import { setProjectAnnotations } from '@storybook/react';
import sbAnnotations from '../.storybook/preview';
import addonInteractions from '@storybook/addon-interactions/preview';
import addonActions from '@storybook/addon-essentials/actions/preview';
import addonBackgrounds from '@storybook/addon-essentials/actions/preview';
import addonDocs from '@storybook/addon-essentials/docs/preview';
import addonHighlight from '@storybook/addon-essentials/highlight/preview';
import addonMeasure from '@storybook/addon-essentials/measure/preview';
import addonOutline from '@storybook/addon-essentials/outline/preview';
import addonViewport from '@storybook/addon-essentials/viewport/preview';

setProjectAnnotations([
  sbAnnotations,
  addonInteractions, // needed for portable stories? instruments spies
  addonActions, // needed for portable stories? adds actions from argTypes?
  addonViewport, // needed for portable stories? sets globals?
  addonBackgrounds, // NOT needed for portable stories
  addonDocs, // NOT needed for portable stories
  addonHighlight, // NOT needed for portable stories
  addonMeasure, // NOT needed for portable stories
  addonOutline, // NOT needed for portable stories
]);
