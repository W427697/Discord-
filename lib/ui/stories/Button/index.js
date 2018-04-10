// @flow
import React from 'react';
import { version, description } from '@material/button/package.json';
import { action } from '@storybook/addon-actions';

import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';
import Button from './Button';

const documentation = {
  name: 'Button',
  description,
  version,
  usage: [
    {
      title: 'Button.js',
      code: `
// @flow
import React, { Component } from 'react'
import '@material/button/dist/mdc.button.min.css'
import { MDCRipple } from '@material/ripple/dist/mdc.ripple.min'

type Props = {
  className?: string,
  children?: React$Node,
  style?: {},
  onClick?: Event => void,
  raised?: boolean,
  disabled?: boolean,
  type?: string,
}

class Button extends Component<Props> {
  static defaultProps = {
    className: '',
    raised: false,
    children: undefined,
    style: undefined,
    onClick: undefined,
    disabled: false,
    type: undefined,
  }

  componentDidMount = () => {
    if (this.button) MDCRipple.attachTo(this.button)
  }

  button: ?HTMLButtonElement

  render = () => {
    const {
      className,
      children,
      onClick,
      style,
      raised,
      disabled,
      type,
    } = this.props

    const raisedClass: string = raised ? 'mdc-button--raised' : ''
    const mainClass: string = \`mdc-button \${className} \${raisedClass}\`.trim()

    return (
      <button
        ref={e => {
          this.button = e
        }}
        style={style}
        className={mainClass}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children}
      </button>
    )
  }
}

export default Button
      `,
    },
    {
      title: 'App.js',
      code: `
import React from 'react'
import ReactDOM from 'react-dom
import Button from './Button'

const App = <Button raised>Button</Button>

ReactDOM.render(App, document.getElementById('root'))
    `,
    },
  ],
  component: (
    <Button
      raised
      onClick={e => {
        action('Button onClick')('clicked', e.target);
      }}
    >
      Button
    </Button>
  ),
};

export default Elements.add('Button', () => <DocPage {...documentation} material />);
