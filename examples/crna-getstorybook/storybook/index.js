import { getStorybookUI, configure } from '@storybook/react-native';

// import stories
configure(() => {
  require('./stories'); // eslint-disable-line global-require
}, module);

const StorybookUI = getStorybookUI({ port: 7007, host: 'localhost' });
export default StorybookUI;
