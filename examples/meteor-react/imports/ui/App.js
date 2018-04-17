/* eslint-disable */
import React, { Component } from 'react';

import StorybookPreview from '@storybook/react/dist/client/preview/StorybookPreview';
import '../storybook/config';

import Task from './Task';

const renderStorybookPreview = document.location.pathname === '/__storybook_preview__';

// App component - represents the whole app
export default class App extends Component {
  getTasks() {
    return [
      { _id: 1, text: 'This is task 1' },
      { _id: 2, text: 'This is task 2' },
      { _id: 3, text: 'This is task 3' },
    ];
  }

  renderTasks() {
    return this.getTasks().map(task => <Task key={task._id} task={task} />);
  }

  render() {
    return renderStorybookPreview ? (
      <StorybookPreview />
    ) : (
      <div className="container">
        <header>
          <h1>Todo List</h1>
        </header>

        <ul>{this.renderTasks()}</ul>
      </div>
    );
  }
}
