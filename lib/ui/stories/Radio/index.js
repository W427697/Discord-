// @flow
import React, { Fragment } from 'react';
import { version, description } from '@material/radio/package.json';
import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

import Example from './Example';

const documentation = {
  name: 'Radio',
  version,
  description,
  requirement: 'yarn add @material/radio @material/form-field',
  component: <Example />,
  usage: [
    {
      title: 'Radio.js',
      code: `
// @flow
import React from 'react'
import '@material/radio/dist/mdc.radio.min.css'
import '@material/form-field/dist/mdc.form-field.min.css'

type Props = { label: string, id: string, name: string, value: string }

const Radio: React$ComponentType<Props> = ({ label, id, name, value }) => (
  <div className="mdc-form-field">
    <div className="mdc-radio">
      <input
        className="mdc-radio__native-control"
        type="radio"
        id={id}
        name={name}
        value={value}
      />
      <div className="mdc-radio__background">
        <div className="mdc-radio__outer-circle" />
        <div className="mdc-radio__inner-circle" />
      </div>
    </div>
    {label && <label htmlFor={id}>{label}</label>}
  </div>
)

export default Radio
    `,
    },
    {
      title: 'App.js',
      code: `
// @flow
import React, { Component } from 'react'
import { render } from 'react-dom'

import Radio from './Radio'

class App extends Component<{}, { value: string }> {
  state = {
    value: '',
  }

  onChange: Event => void = (e: Event) => {
    this.setState({ value: e.target.value })
  }

  render() {
    return (
      <div onChange={this.onChange}>
        <Radio value="female" name="gender" id="female-radio" label="Female" />
        <Radio value="male" name="gender" id="male-radio" label="Male" />
      </div>
    )
  }
}

render(App, document.getElementById('root'))
       `,
    },
  ],
};

export default Elements.add('Radio', () => <DocPage {...documentation} material />);
