import { configure } from '@storybook/surplus';

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.jsx$/), module);
