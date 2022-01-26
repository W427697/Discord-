import { setGlobalConfig, loadGlobalConfig } from '@storybook/react';
import * as globalStorybookConfig from '../.storybook/preview';

// // eslint-disable-next-line no-undef
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// beforeAll(async () => loadGlobalConfig('.storybook'));

loadGlobalConfig('.storybook');
// setGlobalConfig(globalStorybookConfig);

// beforeAll(async () => {
//   console.log('BEFORE ALL');

//   // const globalConfig = await getGlobalConfig('./.storybook');
//   // setGlobalConfig(globalConfig);

//   return new Promise((resolve) => {
//     getGlobalConfig('./.storybook').then((globalCfg) => {
//       setGlobalConfig(globalCfg);
//       resolve(undefined);
//     });
//   });
// });

// (async () => {
//   const globalConfig = await getGlobalConfig('./.storybook');
//   setGlobalConfig(globalConfig);
// })();
