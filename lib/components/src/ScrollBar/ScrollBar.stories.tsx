import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { styled } from '@storybook/theming';
import { ScrollBar } from './ScrollBar';

export default {
  title: 'Basics/ScrollBar',
  component: ScrollBar,
  argTypes: {},
} as ComponentMeta<typeof ScrollBar>;

const Template: ComponentStory<typeof ScrollBar> = (args) => (
  <div style={{ marginLeft: 20, marginTop: 20, position: 'relative' }}>
    <ScrollBar {...args} style={{ width: 400, height: 400 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          padding: 16,
          backgroundColor: 'red',
          width: 1000,
        }}
      >
        <div style={{ backgroundColor: 'orange' }}>
          <div style={{ marginBottom: 16 }}>
            Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
            eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex
            eiusmod cillum ipsum non irure sit. Lorem ut adipisicing mollit reprehenderit aliquip
            nostrud. Ut veniam nulla ipsum laboris sint aliqua cupidatat consectetur minim esse
            nulla laborum culpa. Consequat adipisicing culpa eiusmod laborum consequat ex nulla. Sit
            veniam adipisicing laboris et ullamco fugiat aliqua irure eu labore. Consequat cupidatat
            officia nostrud voluptate in cupidatat et. Ea tempor et deserunt voluptate cupidatat. Ex
            ullamco sit ea nostrud anim nostrud. Laborum ipsum nostrud adipisicing consequat mollit
            laborum anim ex anim dolor ut. Proident eiusmod anim pariatur proident et non
            adipisicing minim ut sit enim reprehenderit occaecat. Aliqua et proident do sunt duis
            laboris mollit do.
          </div>
          <div style={{ marginBottom: 16 }}>
            Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
            eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex
            eiusmod cillum ipsum non irure sit. Exercitation Lorem id non laboris commodo tempor
            occaecat pariatur deserunt ut velit mollit nostrud laborum. Minim eu sint dolor laborum.
            Dolore anim fugiat proident excepteur nostrud. Id fugiat reprehenderit ad fugiat mollit
            velit. Magna consectetur dolore dolore non do cillum ex ad. Cupidatat culpa ex esse amet
            laboris consequat ullamco eu veniam incididunt. Reprehenderit exercitation commodo id
            magna proident. Officia ut laboris qui elit ea fugiat incididunt excepteur nostrud
            voluptate nisi excepteur. Veniam irure deserunt irure eu commodo mollit. Adipisicing
            consequat aliquip officia culpa esse eiusmod Lorem.
          </div>
          <div style={{ marginBottom: 16 }}>
            Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
            eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex
            eiusmod cillum ipsum non irure sit.
          </div>
          <div style={{ marginBottom: 16 }}>
            Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
            eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex
            eiusmod cillum ipsum non irure sit. Exercitation Lorem id non laboris commodo tempor
            occaecat pariatur deserunt ut velit mollit nostrud laborum. Minim eu sint dolor laborum.
            Dolore anim fugiat proident excepteur nostrud. Id fugiat reprehenderit ad fugiat mollit
            velit. Magna consectetur dolore dolore non do cillum ex ad. Cupidatat culpa ex esse amet
            laboris consequat ullamco eu veniam incididunt. Reprehenderit exercitation commodo id
            magna proident. Officia ut laboris qui elit ea fugiat incididunt excepteur nostrud
            voluptate nisi excepteur. Veniam irure deserunt irure eu commodo mollit. Adipisicing
            consequat aliquip officia culpa esse eiusmod Lorem.
          </div>
          <div style={{ marginBottom: 16 }}>
            Labore nisi adipisicing eiusmod commodo mollit tempor velit nostrud fugiat. Anim nulla
            eiusmod mollit exercitation esse. Duis voluptate velit sit minim eu nostrud Lorem ex
            eiusmod cillum ipsum non irure sit. Lorem ut adipisicing mollit reprehenderit aliquip
            nostrud. Ut veniam nulla ipsum laboris sint aliqua cupidatat consectetur minim esse
            nulla laborum culpa. Consequat adipisicing culpa eiusmod laborum consequat ex nulla. Sit
            veniam adipisicing laboris et ullamco fugiat aliqua irure eu labore. Consequat cupidatat
            officia nostrud voluptate in cupidatat et. Ea tempor et deserunt voluptate cupidatat. Ex
            ullamco sit ea nostrud anim nostrud. Laborum ipsum nostrud adipisicing consequat mollit
            laborum anim ex anim dolor ut. Proident eiusmod anim pariatur proident et non
            adipisicing minim ut sit enim reprehenderit occaecat. Aliqua et proident do sunt duis
            laboris mollit do.
          </div>
        </div>
      </div>
    </ScrollBar>
  </div>
);

export const Controllable = Template.bind({});
Controllable.args = {
  vertical: true,
  verticalPosition: 'right',
  horizontal: true,
  horizontalPosition: 'bottom',
  sliderSize: 3,
};
