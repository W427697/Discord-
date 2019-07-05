import emotionStyled, { CreateStyled } from '@emotion/styled';
import { Theme } from './types';

import { createGlobal, createReset } from './global';

import { lightenColor as lighten, darkenColor as darken } from './utils';

export const styled = emotionStyled as CreateStyled<Theme>;

export * from './base';
export * from './types';

export * from '@emotion/core';
export * from 'emotion-theming';
export * from './create';
export * from './convert';
export * from './ensure';

export { createGlobal, createReset, lighten, darken };
