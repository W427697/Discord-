import { h } from 'hyperapp';

const Welcome = () => (
  <div
    style={{
      margin: 15,
      maxWidth: 600,
      lineHeight: 1.4,
      fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
    }}
  >
    <h1>Welcome to STORYBOOK</h1>
    <p>This is a UI component dev environment for your app.</p>
  </div>
);

export default Welcome;
