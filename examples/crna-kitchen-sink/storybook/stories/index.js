import React from 'react';
import { Text } from 'react-native';
import { Usage } from 'storybook-usage';

import { storiesOf, addDecorator, addParameters } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-rn-notes';
import knobsWrapper from './Knobs';
import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

addDecorator(Usage);
addDecorator(withNotes);

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />, {
  notes: `
#Markdown in react-native is so cool! {'\n\n'}

      You can **emphasize** what you want, or just _suggest it_ 😏…{'\n'}

      You can even [**link your website**](https://twitter.com/Charles_Mangwa) or if you prefer: [email somebody](mailto:email@somebody.com){'\n'}

      Spice it up with some GIFs 💃:

      ![Some GIF](https://media.giphy.com/media/dkGhBWE3SyzXW/giphy.gif){'\n'}

      And even add a cool video 😎!{'\n'}

      [![A cool video from YT](https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg)](http://www.youtube.com/watch?v=dQw4w9WgXcQ)

      [![Another one from Vimeo](https://i.vimeocdn.com/video/399486266_640.jpg)](https://vimeo.com/57580368)  `,
});

storiesOf('Button', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('with text', () => (
    <Button onPress={action('clicked-text')}>
      <Text>Hello Button</Text>
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onPress={action('clicked-emoji')}>
      <Text>😀 😎 👍 💯</Text>
    </Button>
  ));

storiesOf('Knobs', module)
  .addDecorator(withKnobs)
  .add('with knobs', knobsWrapper);

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add(
    'passed to story',
    ({ parameters }) => <Text>Parameters are {JSON.stringify(parameters)}</Text>,
    {
      storyParameter,
    }
  );
