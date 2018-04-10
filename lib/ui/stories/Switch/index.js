// @flow
import React, { Fragment } from 'react';
import { version, description } from '@material/switch/package.json';
import { action } from '@storybook/addon-actions';

import '@material/switch/dist/mdc.switch.min.css';
import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const documentation = {
  name: 'Switch',
  description,
  version,
  requirement: `yarn add @material/switch`,
  usage: [
    {
      title: 'index.js',
      code: `
// @flow
import React, { Fragment } from 'react'
import '@material/switch/dist/mdc.switch.min.css'

type Props = {
  label?: string,
  value: boolean,
  onChange: (e: Event) => void,
  id?: string,
  name?: string,
}

const Switch: React$ComponentType<Props> = ({
  label,
  value,
  onChange,
  id,
  name,
}) => (
  <Fragment>
    <div className="mdc-switch" style={{ marginRight: 5 }}>
      <input
        type="checkbox"
        className="mdc-switch__native-control"
        checked={value}
        onChange={onChange}
        id={id}
        name={name}
      />
      <div className="mdc-switch__background">
        <div className="mdc-switch__knob" />
      </div>
    </div>
    {label && (
      <label htmlFor={id} className="mdc-switch-label">
        {label}
      </label>
    )}
  </Fragment>
)

export default Switch
    `,
    },
    {
      title: 'App.js',
      code: `
// @flow
import React, { Component } from 'react'
import { render } from 'react-dom'
import Switch from './Switch'

class App extends Component<{}, { value: boolean }> {
  state = {
    value: false,
  }
  render() {
    return (
      <Switch
        value={this.state.value}
        label="On/off"
        onChange={e => {
          this.setState({ value: !this.state.value })
        }}
      />
    )
  }
}

render(<App />, document.getElementById('root'))
    `,
    },
  ],
  component: (
    <Fragment>
      <div className="mdc-switch" style={{ marginRight: 5 }}>
        <input
          type="checkbox"
          id="basic-switch"
          className="mdc-switch__native-control"
          onChange={e => {
            action('Switch checked')('checked');
          }}
        />
        <div className="mdc-switch__background">
          <div className="mdc-switch__knob" />
        </div>
      </div>
      <label htmlFor="basic-switch" className="mdc-switch-label" style={{ marginLeft: 10 }}>
        Label
      </label>
    </Fragment>
  ),
};

export default Elements.add('Switch', () => <DocPage {...documentation} material />);
