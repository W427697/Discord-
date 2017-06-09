import Channel from '@storybook/channels';

export default function createChannel() {
  const transport = {
    setHandler: () => {},
    send: () => {},
  };

  return new Channel({ transport });
}

try {
  jest.mock('@storybook/addon-options', () => ({
    setOptions: jest.fn(),
  }));
} catch (error) {
  /* didn't need to mock it */
}
try {
  jest.mock('@storybook/addon-actions', () => ({
    action: jest.fn(),
  }));
} catch (error) {
  /* didn't need to mock it */
}
try {
  jest.mock('@storybook/addon-links', () => ({
    linkTo: jest.fn(),
  }));
} catch (error) {
  /* didn't need to mock it */
}
try {
  jest.mock('@storybook/addon-notes', () => ({
    WithNotes: ({ children }) => children,
  }));
} catch (error) {
  /* didn't need to mock it */
}
try {
  jest.mock('@storybook/addon-knobs', () => ({
    withKnobs: a => a(),
    text: jest.fn(),
    number: jest.fn(),
  }));
} catch (error) {
  /* didn't need to mock it */
}
try {
  jest.mock('@storybook/addon-centered', () => a => a());
} catch (error) {
  /* didn't need to mock it */
}
