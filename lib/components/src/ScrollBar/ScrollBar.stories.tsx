import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ScrollBar } from './ScrollBar';

export default {
  title: 'Basics/ScrollBar',
  component: ScrollBar,
  argTypes: {
    sliderColor: { control: { type: 'color' } },
    sliderSize: { control: { type: 'number' } },
    sliderPadding: { control: { type: 'number' } },
    sliderOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
  parameters: {
    test: { disable: true },
    actions: { disable: true },
    layout: 'centered',
  },
} as ComponentMeta<typeof ScrollBar>;

const Template: ComponentStory<typeof ScrollBar> = (args) => (
  <ScrollBar
    {...args}
    style={{
      width: 800,
      height: 400,
      borderRadius: 4,
      border: '1px solid #cccccc',
      backgroundColor: '#ffffff',
      color: '#000000',
    }}
  >
    <div
      style={{
        padding: 32,
        width: 1200,
      }}
    >
      <h1>Nulla non quis enim proident</h1>
      <p>
        Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
        eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex eiusmod
        cillum ipsum non irure sit. Lorem ut adipisicing mollit reprehenderit aliquip nostrud. Ut
        veniam nulla ipsum laboris sint aliqua cupidatat consectetur minim esse nulla laborum culpa.
        Consequat adipisicing culpa eiusmod laborum consequat ex nulla
      </p>
      <p>
        Sit veniam adipisicing laboris et ullamco fugiat aliqua irure eu labore. Consequat cupidatat
        officia nostrud voluptate in cupidatat et. Ea tempor et deserunt voluptate cupidatat. Ex
        ullamco sit ea nostrud anim nostrud. Laborum ipsum nostrud adipisicing consequat mollit
        laborum anim ex anim dolor ut.
      </p>
      <h2> Proident eiusmod anim pariatur proident et non adipisicing</h2>
      <p>
        Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
        eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex eiusmod
        cillum ipsum non irure sit. Exercitation Lorem id non laboris commodo tempor occaecat
        pariatur deserunt ut velit mollit nostrud laborum. Minim eu sint dolor laborum. Dolore anim
        fugiat proident excepteur nostrud. Id fugiat reprehenderit ad fugiat mollit velit. Magna
        consectetur dolore dolore non do cillum ex ad.
      </p>
      <p>
        Cupidatat culpa ex esse amet laboris consequat ullamco eu veniam incididunt. Reprehenderit
        exercitation commodo id magna proident. Officia ut laboris qui elit ea fugiat incididunt
        excepteur nostrud voluptate nisi excepteur. Veniam irure deserunt irure eu commodo mollit.
        Adipisicing consequat aliquip officia culpa esse eiusmod Lorem.
      </p>
      <p>
        Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
        eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex eiusmod
        cillum ipsum non irure sit.
      </p>
      <h2>Labore nisi adipisicing eiusmod commodo mollit</h2>
      <p>
        Tempor velit nostrud fugiat. Anim nulla eiusmod mollit exercitation esse. Duis voluptate
        velit sit minim eu nostrud Lorem ex eiusmod cillum ipsum non irure sit. Exercitation Lorem
        id non laboris commodo tempor occaecat pariatur deserunt ut velit mollit nostrud laborum.
        Minim eu sint dolor laborum. Dolore anim fugiat proident excepteur nostrud. Id fugiat
        reprehenderit ad fugiat mollit velit. Magna consectetur dolore dolore non do cillum ex ad.
        Cupidatat culpa ex esse amet laboris consequat ullamco eu veniam incididunt. Reprehenderit
        exercitation commodo id magna proident. Officia ut laboris qui elit ea fugiat incididunt
        excepteur nostrud voluptate nisi excepteur. Veniam irure deserunt irure eu commodo mollit.
        Adipisicing consequat aliquip officia culpa esse eiusmod Lorem.
      </p>
      <p>
        Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
        eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex eiusmod
        cillum ipsum non irure sit. Lorem ut adipisicing mollit reprehenderit aliquip nostrud. Ut
        veniam nulla ipsum laboris sint aliqua cupidatat consectetur minim esse nulla laborum culpa.
        Consequat adipisicing culpa eiusmod laborum consequat ex nulla. Sit veniam adipisicing
        laboris et ullamco fugiat aliqua irure eu labore. Consequat cupidatat officia nostrud
        voluptate in cupidatat et. Ea tempor et deserunt voluptate cupidatat. Ex ullamco sit ea
        nostrud anim nostrud. Laborum ipsum nostrud adipisicing consequat mollit laborum anim ex
        anim dolor ut. Proident eiusmod anim pariatur proident et non adipisicing minim ut sit enim
        reprehenderit occaecat. Aliqua et proident do sunt duis laboris mollit do.
      </p>
    </div>
  </ScrollBar>
);

export const Controllable = Template.bind({});
Controllable.args = {
  vertical: true,
  verticalPosition: 'right',
  horizontal: true,
  horizontalPosition: 'bottom',
  sliderOpacity: 0.5,
  showOn: 'always',
};
