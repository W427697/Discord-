/* eslint-disable */
import React, { Component } from 'react';

// This line would break webpack
import Meteor from 'meteor/meteor';

// Task component - represents a single todo item
export default class Task extends Component {
  render() {
    return <li>{this.props.task.text}</li>;
  }
}
