/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import AddonInfo, { withInfo, setInfoOptions } from './';

/* eslint-disable */
const TestComponent = ({ func, obj, array, number, string, bool, empty }) =>
  <div>
    <h1>{func}</h1>
    <h2>{obj.toString()}</h2>
    <h3>{array}</h3>
    <h4>{number}</h4>
    <h5>{string}</h5>
    <h6>{bool}</h6>
    <p>{empty}</p>
    <a href="#">test</a>
    <code>storiesOf</code>
    <ui>
      <li>1</li>
      <li>2</li>
    </ui>
  </div>;
/* eslint-enable */

const testContext = { kind: 'addon_info', story: 'jest_test' };
const testOptions = { propTables: false, sendToPanel: false, hideInfoButton: false };

describe('addon Info', () => {
  const story = context =>
    <div>
      It's a {context.story} story:
      <TestComponent
        func={x => x + 1}
        obj={{ a: 'a', b: 'b' }}
        array={[1, 2, 3]}
        number={7}
        string={'seven'}
        bool
      />
    </div>;
  const api = {
    add: (name, fn) => fn(testContext),
  };
  it('should set options', () => {
    setInfoOptions(testOptions);
  });
  it('should render <Info /> with markdown summary', () => {
    const Info = withInfo(
      '# Test story \n## with markdown info \ncontaing **bold**, *cursive* text and `code`'
    )(story);
    ReactDOM.render(<Info />, document.createElement('div'));
  });
  it('should render <Info /> with JSX summary', () => {
    const Info = withInfo(
      <div>
        This is summary with <button>button</button> element
      </div>
    )(story);
    ReactDOM.render(<Info />, document.createElement('div'));
  });
  it('should render with options', () => {
    const Info = withInfo({ summary: 'some text here' })(story);
    ReactDOM.render(<Info />, document.createElement('div'));
  });
  it('should render with missed info', () => {
    const Info = withInfo()(story);
    ReactDOM.render(<Info />, document.createElement('div'));
  });
  it('should show deprecation warning', () => {
    const addWithInfo = AddonInfo.addWithInfo.bind(api);
    addWithInfo('jest', story);
  });
});
