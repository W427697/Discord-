import React from 'react';
import { version, description } from '@material/fab/package.json';
import { action } from '@storybook/addon-actions';

import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';
import Fab from './Fab';

const documentation = {
  name: 'Fab',
  description,
  version,
  usage: [
    {
      title: 'Fab.js',
      code: `
// @flow
import React from 'react'
import '@material/fab/dist/mdc.fab.min.css'

type Props = {
  className?: string,
  style?: {},
  iconName: string,
  small?: boolean,
  onClick: (e: MouseEvent) => void,
}

const Fab: React$ComponentType<Props> = ({
  className,
  style,
  iconName,
  small = false,
  onClick,
}) => {
  const smallClass: string = small ? 'mdc-fab--mini' : ''
  const mainClass: string = \`mdc-fab material-icons \${smallClass} \${className || ''}\`.trim()
  return (
    <button className={mainClass} style={style} onClick={onClick}>
      <span className="mdc-fab__icon">{iconName}</span>
    </button>
  )
}

export default Fab

      `,
    },
    {
      title: 'App.js',
      code: `
import React from 'react'
import ReactDOM from 'react-dom
import Fab from './Button'

const App = <Fab iconName="add" onClick={() => { console.log('you use the fab!') }} />

ReactDOM.render(App, document.getElementById('root'))
    `,
    },
  ],
  component: (
    <Fab
      iconName="add"
      onClick={() => {
        action('Fab clicked')('clicked');
      }}
    />
  ),
};

export default Elements.add('Fab', () => <DocPage {...documentation} material />);
