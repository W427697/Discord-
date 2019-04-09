import React from 'react';
import { Grid, Map, createBlessedComponent } from 'react-blessed-contrib';
import contrib from 'blessed-contrib';
import throttle from 'react-throttle-render';

const MyBlessedWidget = createBlessedComponent(contrib.donut);

const Dashboard = ({ manager, preview, server }) => (
  <Grid rows={12} cols={12} color="red" dashboardMargin={0} hideBorder={true}>
    <box row={0} col={0} rowSpan={4} colSpan={12}>
      Some text
    </box>
    <box row={4} col={0} rowSpan={8} colSpan={12}>
      <Grid rows={12} cols={12} color="blue">
        <Map row={0} col={0} rowSpan={4} colSpan={12} label="World Map" />
        <box row={4} col={0} rowSpan={8} colSpan={12}>
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
        </box>
      </Grid>
    </box>
  </Grid>
);

export const DebouncedDashboard = throttle(30)(Dashboard);
