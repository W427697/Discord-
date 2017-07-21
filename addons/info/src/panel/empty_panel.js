import React from 'react';

const styles = {
  main: {
    fontFamily:
      '-apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif',
    display: 'inline',
    width: '100%',
    textAlign: 'center',
    color: 'rgb(190, 190, 190)',
    padding: 10,
  },
  code: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    border: 'solid 1px rgba(0,0,0,0.3)',
    color: 'rgb(90, 90, 90)',
    borderRadius: 4,
    padding: 4,
  },
};

function EmptyPanel() {
  return (
    <div style={styles.main}>
      INFO PANEL
      <p>No info provided for this story</p>
      <p>
        Use <code style={styles.code}>withInfo()</code> to add info addon
      </p>
      <p>
        See{' '}
        <a href="https://github.com/storybooks/storybook/tree/master/addons/info">
          storybook-addon-info
        </a>{' '}
        for details
      </p>
    </div>
  );
}

export default EmptyPanel;
