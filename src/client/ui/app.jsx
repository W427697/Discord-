import * as React from 'react';
import { getSyncedStore } from '../';

/**
 * Represents the root of the administration application.
 *
 * @remarks
 * As react-router does not allow you to provide props to components
 * the root of the application must create its own state.
 * The application can then pass props to any child routes.
 */
export default class App extends React.Component {
  constructor() {
    super();
    this.state = { syncedStore: getSyncedStore() };
  }
    /**
     * Renders the component.
     *
     * @returns {JSX.Element} The element representing the component.
     */
  render() {
    return React.cloneElement(this.props.children, { syncedStore: this.state.syncedStore });
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};
