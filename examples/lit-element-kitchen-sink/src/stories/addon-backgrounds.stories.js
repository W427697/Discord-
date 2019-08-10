import '../components/simple-message';

export default {
  title: 'Addons|Backgrounds',
  parameters: {
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  },
};

export const story1 = () =>
  `<simple-message color='white' message='You should be able to switch backgrounds for this story'></simple-message>`;
story1.story = { name: 'story 1' };

export const story2 = () => `<simple-message color='white'>This one too!</simple-message>`;
story2.story = { name: 'story 2' };
