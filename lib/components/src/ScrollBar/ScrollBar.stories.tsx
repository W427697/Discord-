import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';
import { styled } from '@storybook/theming';
import { ScrollBar } from './ScrollBar';

export default {
  title: 'Basics/ScrollBar',
  component: ScrollBar,
} as Meta;

const Template: ComponentStory<typeof ScrollBar> = (args) => (
  <div style={{ marginLeft: 20, marginTop: 20, position: 'relative', left: 20 }}>
    <ScrollBar {...args} style={{ width: 400, height: 400 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          padding: 16,
          backgroundColor: 'red',
          width: 1400,
          height: 3000,
        }}
      >
        <div style={{ backgroundColor: 'orange' }}>
          <div>
            Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
            eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex
            eiusmod cillum ipsum non irure sit.
          </div>
          <div>
            Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
            eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex
            eiusmod cillum ipsum non irure sit.
          </div>
          <div>
            Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
            eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex
            eiusmod cillum ipsum non irure sit.
          </div>
        </div>
      </div>
    </ScrollBar>
  </div>
);

export const Controllable = Template.bind({});
Controllable.args = {
  vertical: true,
  horizontal: true,
};
