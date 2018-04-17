import React from 'react';
import { document } from 'global';

// Would want to wrap this in a if (process.env.NODE_ENV === 'development') somehow
import StorybookPreview from '@storybook/react/dist/client/preview/StorybookPreview';
import './.storybook/config';

import logo from './logo.svg';
import './App.css';

const renderStorybookPreview = document.location.pathname === '/__storybook_preview__';

const App = () =>
  renderStorybookPreview ? (
    <StorybookPreview />
  ) : (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );

export default App;
