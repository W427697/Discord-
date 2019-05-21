import React from 'react';
import {} from 'react-blessed';
import { Grid, Map, createBlessedComponent } from 'react-blessed-contrib';
import contrib from 'blessed-contrib';
import throttle from 'react-throttle-render';

import { State } from '../types';

const MyBlessedWidget = createBlessedComponent(contrib.donut);

const Dashboard = ({ manager, preview, server }: State) => (
  <Grid rows={12} cols={12} hideBorder>
    <blessed-box row={4} col={0} rowSpan={8} colSpan={12}>
      Some text
    </blessed-box>
    <blessed-box row={4} col={0} rowSpan={8} colSpan={12}>
      <Grid rows={12} cols={12}>
        <Map row={0} col={0} rowSpan={4} colSpan={12} label="World Map!" />
        <blessed-box row={4} col={0} rowSpan={8} colSpan={12}>
          <MyBlessedWidget
            radius={16}
            arcWidth={4}
            yPadding={2}
            data={[
              { label: 'Server', percent: 0 },
              { label: 'Manager', percent: manager.progress || 0 },
              { label: 'Preview', percent: 0 },
            ]}
          />
        </blessed-box>
      </Grid>
    </blessed-box>
  </Grid>
);

export const DebouncedDashboard = throttle(30)(Dashboard);
