/* global document */

import React from 'react';
import EventEmiter from 'eventemitter3';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { addonNotes, WithNotes } from '@storybook/addon-notes';
import { linkTo } from '@storybook/addon-links';
import WithEvents from '@storybook/addon-events';
import {
  withKnobs,
  addonKnobs,
  text,
  number,
  boolean,
  color,
  select,
  array,
  date,
  object,
} from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';
import { setOptions } from '@storybook/addon-options';
import { withInfo } from '@storybook/addon-info';

import { Button, Welcome } from '@storybook/react/demo';

import App from '../App';
import Logger from './Logger';

const EVENTS = {
  TEST_EVENT_1: 'test-event-1',
  TEST_EVENT_2: 'test-event-2',
  TEST_EVENT_3: 'test-event-3',
  TEST_EVENT_4: 'test-event-4',
};

const emiter = new EventEmiter();
const emit = emiter.emit.bind(emiter);

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

const InfoButton = () =>
  <span
    style={{
      fontFamily: 'sans-serif',
      fontSize: 12,
      textDecoration: 'none',
      background: 'rgb(34, 136, 204)',
      color: 'rgb(255, 255, 255)',
      padding: '5px 15px',
      margin: 10,
      borderRadius: '0px 0px 0px 5px',
    }}
  >
    {' '}Show Info{' '}
  </span>;

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>)
  .add('with notes', () =>
    <WithNotes notes={'A very simple button'}>
      <Button>Check my notes in the notes panel</Button>
    </WithNotes>
  )
  .add('with knobs', () => {
    const name = text('Name', 'Storyteller');
    const age = number('Age', 70, { range: true, min: 0, max: 90, step: 5 });
    const fruits = {
      apple: 'Apple',
      banana: 'Banana',
      cherry: 'Cherry',
    };
    const fruit = select('Fruit', fruits, 'apple');
    const dollars = number('Dollars', 12.5);

    // NOTE: color picker is currently broken
    const backgroundColor = color('background', '#ffff00');
    const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
    const otherStyles = object('Styles', {
      border: '3px solid #ff00ff',
      padding: '10px',
    });
    const nice = boolean('Nice', true);

    // NOTE: put this last because it currently breaks everything after it :D
    const birthday = date('Birthday', new Date('Jan 20 2017'));

    const intro = `My name is ${name}, I'm ${age} years old, and my favorite fruit is ${fruit}.`;
    const style = { backgroundColor, ...otherStyles };
    const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';

    return (
      <div style={style}>
        <p>
          {intro}
        </p>
        <p>
          My birthday is: {new Date(birthday).toLocaleDateString()}
        </p>
        <p>
          My wallet contains: ${dollars.toFixed(2)}
        </p>
        <p>In my backpack, I have:</p>
        <ul>
          {items.map(item =>
            <li key={item}>
              {item}
            </li>
          )}
        </ul>
        <p>
          {salutation}
        </p>
      </div>
    );
  })
  .addWithInfo(
    'with some info',
    'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its painful API.',
    context =>
      <div>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </div>
  )
  .add(
    'with new info',
    withInfo(
      'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its new painless API.'
    )(context =>
      <div>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </div>
    )
  )
  .add(
    'addons composition',
    withInfo('see Notes panel for composition info')(
      addonNotes({ notes: 'Composition: Info(Notes())' })(context =>
        <div>
          click the <InfoButton /> label in top right for info about "{context.story}"
        </div>
      )
    )
  );

const textButton = (size, bgcolor, isText = true) => () =>
  <button
    style={{
      color: 'white',
      border: '2px solid darkgray',
      borderRadius: 8,
      padding: 6 + size,
      paddingTop: 6,
      paddingBottom: 6,
      margin: 20,
      fontSize: size,
      backgroundColor: bgcolor,
      cursor: 'pointer',
    }}
    size={size}
    color={bgcolor}
    onClick={action(`${bgcolor} button with ${isText ? 'text' : 'train'}`)}
  >
    {isText ? 'Press me!' : '🚂🚃🚃🚃🚃🚃🚃🚃🚃'}
  </button>;

const decorStyle = (isEmoji, isTile) => ({
  borderTop: '1px solid rgba(255, 255, 255, 1)',
  borderBottom: '1px solid rgba(128, 128, 128, 0.4)',
  backgroundColor: isEmoji ? 'rgba(230, 255, 240, 0.5)' : 'rgba(230, 240, 255, 0.5)',
  marginBottom: 16,
  marginRight: 26,
  minWidth: isTile ? 260 : '',
  minHeight: isTile ? 156 : '',
});

const storyTitleStyle = isSelected => ({
  fontFamily: 'sans-serif',
  fontSize: 30,
  fontVariantCaps: 'small-caps',
  color: isSelected ? 'rgb(20, 20, 20)' : 'rgba(90, 90, 90, 0.7)',
  margin: 4,
  fontWeight: isSelected ? 'bold' : '',
  cursor: 'pointer',
});

const storyContextStyle = isSelected => ({
  fontFamily: 'sans-serif',
  fontSize: 14,
  color: isSelected ? 'rgba(20, 20, 20, 0.8)' : 'rgba(90, 90, 90, 0.5)',
  margin: 4,
});

const guideDecorator = (isEmoji = false, isTile = false) => (storyfn, context) => {
  context.onStoryDidMount(id => {
    const currentStoryHolder = document.getElementById(id);
    if (currentStoryHolder) currentStoryHolder.scrollIntoView();
  });

  return (
    <div style={decorStyle(isEmoji, isTile)}>
      <a onClick={linkTo(context.kind, context.story)} role="link" tabIndex="0">
        <h1 style={storyTitleStyle(context.story === context.selectedStory)}>
          {context.story}
        </h1>
      </a>
      <p style={storyContextStyle(context.story === context.selectedStory)}>
        {context.kind.replace(context.kindRoot, '').replace(/^\./, '') || context.kind}
      </p>
      <WithNotes
        notes={`This is ${context.kind}\n\nYou selected: [${context.selectedStory}] button!\n
            Use Ctrl + Shift + Arrow Left (Right) to navigate\n
            ...Or select the button from the Stories Panel\n
            ...Or click on a button story title`}
      />
      {storyfn()}
    </div>
  );
};

const normalDecorator = stories =>
  <div>
    {stories}
  </div>;

const tileDecorator = stories =>
  <div>
    <h1>Button Tiles</h1>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'stretch',
      }}
    >
      {stories}
    </div>
  </div>;

storiesOf('Buttons Guide:.simple', module)
  .addDecorator(guideDecorator())
  .add('normal small', () => {
    setOptions({
      previewDecorator: normalDecorator,
    });
    return textButton(10, 'coral')();
  })
  .add('normal big', textButton(14, 'coral'))
  .add('normal enormous', textButton(18, 'coral'))
  .add('normal giant', textButton(26, 'coral'))
  .add('accent small', textButton(10, 'crimson'))
  .add('accent big', textButton(14, 'crimson'))
  .add('accent enormous', textButton(18, 'crimson'))
  .add('accent giant', textButton(26, 'crimson'))
  .add('disabled small', textButton(10, 'gray'))
  .add('disabled big', textButton(14, 'gray'))
  .add('disabled enormous', textButton(18, 'gray'))
  .add('disabled giant', textButton(26, 'gray'));

storiesOf('Buttons Guide:.emoji', module)
  .addDecorator(guideDecorator(true))
  .add('normal small', textButton(18, 'coral', false))
  .add('normal big', textButton(22, 'coral', false))
  .add('normal enormous', textButton(28, 'coral', false))
  .add('normal giant', textButton(36, 'coral', false))
  .add('accent small', textButton(18, 'crimson', false))
  .add('accent big', textButton(22, 'crimson', false))
  .add('accent enormous', textButton(28, 'crimson', false))
  .add('accent giant', textButton(36, 'crimson', false))
  .add('disabled small', textButton(18, 'gray', false))
  .add('disabled big', textButton(22, 'gray', false))
  .add('disabled enormous', textButton(28, 'gray', false))
  .add('disabled giant', textButton(36, 'gray', false));

storiesOf('Buttons Guide.tile:', module)
  .addDecorator(guideDecorator(false, true))
  .add('normal small', () => {
    setOptions({
      previewDecorator: tileDecorator,
    });
    return textButton(10, 'coral')();
  })
  .add('normal big', textButton(14, 'coral'))
  .add('normal enormous', textButton(18, 'coral'))
  .add('normal giant', textButton(26, 'coral'))
  .add('accent small', textButton(10, 'crimson'))
  .add('accent big', textButton(14, 'crimson'))
  .add('accent enormous', textButton(18, 'crimson'))
  .add('accent giant', textButton(26, 'crimson'))
  .add('disabled small', textButton(10, 'gray'))
  .add('disabled big', textButton(14, 'gray'))
  .add('disabled enormous', textButton(18, 'gray'))
  .add('disabled giant', textButton(26, 'gray'));

storiesOf('App', module).add('full app', () => <App />);

storiesOf('Centered Button', module)
  .addDecorator(centered)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);

storiesOf('WithEvents', module)
  .addDecorator(getStory =>
    <WithEvents
      emit={emit}
      events={[
        {
          name: EVENTS.TEST_EVENT_1,
          title: 'Test event 1',
          payload: 0,
        },
        {
          name: EVENTS.TEST_EVENT_2,
          title: 'Test event 2',
          payload: 'Test event 2',
        },
        {
          name: EVENTS.TEST_EVENT_3,
          title: 'Test event 3',
          payload: {
            string: 'value',
            number: 123,
            array: [1, 2, 3],
            object: {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
          },
        },
        {
          name: EVENTS.TEST_EVENT_4,
          title: 'Test event 4',
          payload: [
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
          ],
        },
      ]}
    >
      {getStory()}
    </WithEvents>
  )
  .add('Logger', () => <Logger emiter={emiter} />);

storiesOf('addonNotes', module)
  .add('with some text', addonNotes({ notes: 'Hello guys' })(() => <div>Hello guys</div>))
  .add('with some emoji', addonNotes({ notes: 'My notes on emojies' })(() => <p>🤔😳😯😮</p>))
  .add(
    'with a button and some emoji',
    addonNotes({ notes: 'My notes on a button with emojies' })(() =>
      <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
    )
  )
  .add('with old API', () =>
    <WithNotes notes="Hello">
      <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
    </WithNotes>
  );

storiesOf('Addon Knobs deprecated Decorator', module)
  .addDecorator(withKnobs) // test deprecated
  .add('with dynamic variables deprecated', () => {
    const name = text('Name', 'Story Teller');
    const age = number('Age', 120);

    const content = `I am ${name} and I'm ${age} years old.`;
    return (
      <div>
        {content}
      </div>
    );
  });

storiesOf('Addon Knobs', module).add(
  'with dynamic variables new method',
  addonKnobs()(() => {
    const name = text('Name', 'Arunoda Susiripala');
    const age = number('Age', 89);

    const content = `I am ${name} and I'm ${age} years old.`;
    return (
      <div>
        {content}
      </div>
    );
  })
);

storiesOf('component.base.Link')
  .addDecorator(withKnobs)
  .add('first', () =>
    <a>
      {text('firstLink', 'first link')}
    </a>
  )
  .add('second', () =>
    <a>
      {text('secondLink', 'second link')}
    </a>
  );

storiesOf('component.base.Span')
  .add('first', () => <span>first span</span>)
  .add('second', () => <span>second span</span>);

storiesOf('component.common.Div')
  .add('first', () => <div>first div</div>)
  .add('second', () => <div>second div</div>);

storiesOf('component.common.Table')
  .add('first', () =>
    <table>
      <tr>
        <td>first table</td>
      </tr>
    </table>
  )
  .add('second', () =>
    <table>
      <tr>
        <td>first table</td>
      </tr>
    </table>
  );

storiesOf('component.Button')
  .add('first', () => <button>first button</button>)
  .add('second', () => <button>first second</button>);

// Atomic

storiesOf('Cells¯\\_(ツ)_/¯Molecules.Atoms/simple', module)
  .addDecorator(withKnobs)
  .add('with text', () =>
    <Button>
      {text('buttonText', 'Hello Button')}
    </Button>
  )
  .add('with some emoji', () => <Button>😀 😎 👍 💯</Button>);

storiesOf('Cells/Molecules/Atoms.more', module)
  .add('with text2', () => <Button>Hello Button</Button>)
  .add('with some emoji2', () => <Button>😀 😎 👍 💯</Button>);

storiesOf('Cells/Molecules', module)
  .add('with text', () => <Button>Hello Button</Button>)
  .add('with some emoji', () => <Button>😀 😎 👍 💯</Button>);

storiesOf('Cells.Molecules.Atoms', module)
  .add('with text2', () => <Button>Hello Button</Button>)
  .add('with some emoji2', () => <Button>😀 😎 👍 💯</Button>);
