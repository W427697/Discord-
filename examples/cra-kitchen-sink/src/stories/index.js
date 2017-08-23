import React from 'react';
import EventEmiter from 'eventemitter3';

import { storiesOf } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { action } from '@storybook/addon-actions';
import { withNotes, WithNotes } from '@storybook/addon-notes';
import { linkTo } from '@storybook/addon-links';
import WithEvents from '@storybook/addon-events';
import {
  withKnobs,
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
import { withInfo, setInfoOptions } from '@storybook/addon-info';

import { Button, Welcome } from '@storybook/react/demo';

import App from '../App';
import reactLogo from '../logo.svg';
import Logger from './Logger';
import Container from './Container';
import DocgenButton from '../components/DocgenButton';
import FlowTypeButton from '../components/FlowTypeButton';
import markdown from '../../../../addons/info/src/components/stories/mock-data/summary.md';

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

setInfoOptions({
  summary: 'This is common info',
});

storiesOf('Button', module)
  .addDecorator((storyFn, context) => withInfo('This is **Button** info')(storyFn)(context))
  .addDecorator(withKnobs)
  .add('with text', () =>
    <Button onClick={action('clicked')}>
      {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
      Hello Button
    </Button>
  )
  .add('with some emoji', () =>
    <Button onClick={action('clicked')}>
      {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
      😀 😎 👍 💯
    </Button>
  )
  .add('with notes', () =>
    <WithNotes notes={'A very simple button'}>
      <Button>
        {setOptions({ selectedAddonPanel: 'storybook/notes/panel' })}
        Check my notes in the notes panel
      </Button>
    </WithNotes>
  )
  .add('with knobs', () => {
    setOptions({ selectedAddonPanel: 'storybooks/storybook-addon-knobs' });
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
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    return (
      <div style={style}>
        <p>
          {intro}
        </p>
        <p>
          My birthday is: {new Date(birthday).toLocaleDateString('en-US', dateOptions)}
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
  .add('with setInfoOptions', () => {
    setInfoOptions('this info is **overridden** by setInfoOptions');
    return <Button onClick={action('clicked')}>Button with Info</Button>;
  });

storiesOf('Info Addon', module)
  .add(
    'Info default',
    withInfo(
      'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its new painless API.'
    )(context =>
      <Container>
        {setOptions({ selectedAddonPanel: 'storybook/info/info-panel' })}
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    )
  )
  .add(
    'DocgenButton',
    withInfo(`
      # Docgen Button

      It demonstrates how your component can be documented via [babel-plugin-react-docgen](https://github.com/storybooks/babel-plugin-react-docgen). You just need to add comments in your component \`propTypes\` this way:

      ~~~js
      DocgenButton.propTypes = {
        /** Boolean indicating whether the button should render as disabled */
        disabled: PropTypes.bool,
        /** button label. */
        label: PropTypes.string.isRequired,
        /** onClick handler */
        onClick: PropTypes.func,
      }
      ~~~
      
      See results in the **Prop Types** section below

      `)(() => <DocgenButton onClick={action('clicked')} label="Docgen Button" />)
  )
  .add(
    'FlowTypeButton',
    withInfo(`
      # FlowType Button
      
      It demonstrates how your component can be documented via [Flow](https://flow.org/). You just need to add types and comments to your component this way:

      ~~~js
      type PropsType = {
        /** The text to be rendered in the button */
        label: string,
        /** Function to be called when the button is clicked */
        onClick?: Function,
        /** Boolean representing wether the button is disabled */
        disabled?: boolean,
      };
      ~~~

      See results in the **Prop Types** section below
            
    `)(() => <FlowTypeButton onClick={action('clicked')} label="Flow Typed Button" />)
  )
  .add(
    'Info with options',
    withInfo({
      summary:
        'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its new painless API.',
      inline: false,
      propTables: false,
      header: false,
      source: true,
    })(context =>
      <Container>
        click the <InfoButton /> label in top right for info about "{context.story}" this button has
        very-very-very-very looooooong title
      </Container>
    )
  )
  .add(
    'Only summary with markdown',
    withInfo({
      summary: markdown,
      inline: false,
      propTables: false,
      header: false,
      source: false,
    })(context =>
      <Container>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    )
  )
  .add(
    'React Element in summary',
    withInfo({
      summary: (
        <div>
          <h2>This is a JSX info section</h2>
          <p>
            Storybook is very easy to use. You can use it with any kind of React or Vue project.
            Follow these steps to get started with Storybook:
          </p>
          <code
            style={{
              margin: 20,
              padding: 10,
              backgroundColor: 'hsl(0, 0%, 35%)',
              color: 'hsl(0, 0%, 90%)',
              display: 'block',
              fontSize: 12,
            }}
          >
            {'cd my-react-app'}
            <br />
            {'npm i -g @storybook/cli'}
            <br />
            {'getstorybook'}
            <br />
          </code>
          <p style={{ textAlign: 'center' }}>
            <style>
              {`@keyframes App-logo-spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }`}
            </style>
            <img
              style={{
                animation: 'App-logo-spin infinite 20s linear',
                maxWidth: 400,
              }}
              src={reactLogo}
              alt="react logo"
            />
          </p>
          <p style={{ textAlign: 'right' }}>
            <a href="https://github.com/storybooks/storybook/tree/master/addons/info">
              @storybook/addon-info
            </a>
          </p>
        </div>
      ),
      inline: false,
      propTables: false,
      header: false,
      source: false,
    })(context =>
      <Container>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    )
  )
  .add(
    'Only component source',
    withInfo({
      summary: null,
      inline: false,
      propTables: false,
      header: false,
      source: true,
    })(context =>
      <Container>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    )
  )
  .add(
    'Only propTypes and header',
    withInfo({
      summary: null,
      inline: false,
      propTables: [Container],
      propTablesExclude: [InfoButton],
      header: true,
      source: false,
    })(context =>
      <div>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </div>
    )
  )
  .add(
    'decoratorInfo',
    withInfo({
      summary:
        'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its new painless API.',
      inline: false,
      sendToPanel: false,
      infoButton: true,
    })(context =>
      <Container>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    )
  )
  .add(
    'JSX as an argument',
    withInfo(
      <div>
        This is summary with <button>button</button> element
      </div>
    )(context =>
      <Container>
        {setOptions({ selectedAddonPanel: 'storybook/info/info-panel' })}
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    )
  )
  .add(
    'With custom components',
    withInfo({
      summary: `
        # Components overriding

        Here we can override some components. We support prevoius API - \`marksyConf\` but it will be deprecated. So better to use new API - \`components\` with the same syntax.

        In order to pass your own component to markdown set this option this way:

        ~~~js
        components: {
          h2: props => <h2 {...props} style={{color: 'blue'}} />,
        }
        ~~~

        Lets override **H2** heading via \`components\` and **H3** via old \`marksyConf\` API:

        ## H2 - it should be blue

        ### H3 - it should be brown
      `,
      marksyConf: {
        h3: props => <h3 {...props} style={{color: 'brown'}} />, // eslint-disable-line
      },
      components: {
        h2: props => <h2 {...props} style={{color: 'blue'}} />, // eslint-disable-line
      },
    })(context =>
      <Container>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    )
  )
  .add(
    'addons composition',
    withInfo('see Notes panel for composition info')(
      withNotes('Composition: Info(Notes())')(context =>
        <div>
          {setOptions({ selectedAddonPanel: 'storybook/notes/panel' })}
          click the <InfoButton /> label in top right for info about "{context.story}"
        </div>
      )
    )
  )
  .addWithInfo(
    'deprecated addWithInfo',
    'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its painful API.',
    context =>
      <div>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </div>
  );

storiesOf('Addons composition', module)
  .addDecorator((storyFn, context) =>
    withInfo()(withNotes('the non-trivial form of addons composition')(storyFn))(context)
  )
  .add('with text', () => {
    setInfoOptions('this *button* contain **text**');
    return <Button onClick={action('clicked')}>Hello Button</Button>;
  })
  .add('with some emoji', () => {
    setInfoOptions('this *button* contain **some emoji**');
    return <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>;
  });

storiesOf('App', module).add('full app', () => <App />);

storiesOf('Some really long story kind description', module)
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

storiesOf('withNotes', module)
  .add('with some text', withNotes('Hello guys')(() => <div>Hello guys</div>))
  .add('with some emoji', withNotes('My notes on emojies')(() => <p>🤔😳😯😮</p>))
  .add(
    'with a button and some emoji',
    withNotes('My notes on a button with emojies')(() =>
      <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
    )
  )
  .add('with old API', () =>
    <WithNotes notes="Hello">
      <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
    </WithNotes>
  );

storiesOf('component.base.Link', module)
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

storiesOf('component.base.Span', module)
  .add('first', () => <span>first span</span>)
  .add('second', () => <span>second span</span>);

storiesOf('component.common.Div', module)
  .add('first', () => <div>first div</div>)
  .add('second', () => <div>second div</div>);

storiesOf('component.common.Table', module)
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

storiesOf('component.Button', module)
  .add('first', () => <button>first button</button>)
  .add('second', () => <button>first second</button>);

// Atomic

storiesOf('Cells/Molecules.Atoms/simple', module)
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
