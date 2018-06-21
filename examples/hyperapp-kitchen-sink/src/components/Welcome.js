import { h } from 'hyperapp';
import picostyle from 'picostyle';

const style = picostyle(h);

const Main = style('div')({
  margin: '15px',
  maxWidth: '600px',
  lineHeight: 1.4,
  fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
});

const Code = style('code')({
  fontSize: '15px',
  fontWeight: '600',
  padding: '2px 5px',
  border: '1px solid #eae9e9',
  borderRadius: '4px',
  backgroundColor: '#f3f2f2',
  color: '#3a3a3a',
});

const Logo = style(() => (
  <svg
    width="100"
    viewBox="0 0 691 585"
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 1.41421,
    }}
  >
    <g transform="matrix(1,0,0,1,-154.583,-207.856)">
      <g transform="matrix(2.45578,0,0,2.45578,154.583,207.856)">
        <path
          d="M245.853,47.585L93.936,47.585L111.257,0L60.618,0L0,166.547L50.637,166.547L76.618,95.17L228.531,95.17L219.871,118.962L93.41,118.962L67.363,190.339L67.363,190.34C65.948,194.226 65.224,198.331 65.224,202.467C65.224,221.918 81.23,237.924 100.681,237.924L176.57,237.924L193.89,190.339L118.001,190.339L126.728,166.547L202.551,166.547L193.891,190.339L244.53,190.339L279.171,95.17L279.171,95.169C280.586,91.283 281.31,87.178 281.31,83.042C281.31,63.591 265.304,47.585 245.853,47.585Z"
          style={{ fillRule: 'nonzero' }}
        />
      </g>
    </g>
  </svg>
))({
  margin: '15px',
});

const Welcome = () => (
  <Main>
    <h1>Welcome to Storybook for Hyperapp</h1>
    <p>This is a UI component dev environment for your Hyperapp components.</p>
    <p>
      We've added some basic stories inside the <Code>stories</Code> directory. A story is a single
      state of one or more UI components. You can have as many stories as you want. (Basically a
      story is like a visual test case.)
    </p>
    <p>
      See these sample{' '}
      <a href="/" data-sb-kind="Demo" data-sb-story="button">
        stories
      </a>.
    </p>
    <p>
      <Logo />
    </p>
    <p>
      Just like that, you can add your own snippets as stories. You can also edit those snippets and
      see changes right away.
    </p>
    <p>
      Usually we create stories with smaller UI components in the app. Have a look at the{' '}
      <a
        href="https://storybook.js.org/basics/writing-stories"
        target="_blank"
        rel="noopener noreferrer"
      >
        Writing Stories
      </a>{' '}
      section in our documentation.
    </p>
  </Main>
);

export default Welcome;
