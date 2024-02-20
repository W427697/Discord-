import { ReactRenderer, setProjectAnnotations } from '@storybook/react';
import sbAnnotations from '../.storybook/preview';
import addonInteractions from '@storybook/addon-interactions/preview';
import addonActions from '@storybook/addon-essentials/actions/preview';
import { ProjectAnnotations } from '../../../../code/lib/types/src';

setProjectAnnotations([
  sbAnnotations,
  addonInteractions as ProjectAnnotations<ReactRenderer>, // instruments actions as spies
  addonActions as ProjectAnnotations<ReactRenderer>, // creates actions from argTypes
]);
