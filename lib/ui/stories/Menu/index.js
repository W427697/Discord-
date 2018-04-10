// @flow
import React, { Fragment } from 'react';
import { version, description } from '@material/menu/package.json';
import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

import Example from './Example';

const documentation = {
  name: 'Menu',
  version,
  description,
  requirement: 'yarn add @material/list @material/menu',
  component: <Example />,
  usage: [
    {
      title: 'Menu.js',
      code: `
// @flow
import React, { Component } from 'react'
import { MDCMenu, Corner } from '@material/menu/dist/mdc.menu.min'
import '@material/list/dist/mdc.list.min.css'
import '@material/menu/dist/mdc.menu.min.css'

type ItemType = React$StatelessFunctionalComponent<{
  children: React$Node,
  className?: string,
  style?: {},
  onClick?: (e: Event) => void,
}>

export const Item: ItemType = ({ children, className, style, onClick }) => {
  return (
    <li
      className={\`\${className || ''} mdc-list-item\`}
      role="menuitem"
      tabIndex="0"
      style={style}
      onClick={onClick}
    >
      {children}
    </li>
  )
}

type AnchorType = React$StatelessFunctionalComponent<{
  className?: string,
}>

export const Anchor: AnchorType = ({ className, ...props }) => {
  return <div {...props} className={\`\${className || ''} mdc-menu-anchor\`} />
}

type Props = {
  open: boolean,
  children: React$Element<ItemType> | React$ChildrenArray<ItemType>,
}

export default class Menu extends Component<Props> {
  componentDidMount = () => {
    if (this.ref) {
      this.menu = new MDCMenu(this.ref)
      /*
       * Anchor based on the edges of the window
       */
      this.menu.setAnchorCorner(Corner.BOTTOM_START)
    }
  }
  componentWillReceiveProps = (nextProps: Props) => {
    this.menu.open = nextProps.open
  }

  menu: MDCMenu
  ref: ?HTMLDivElement
  render() {
    const { children } = this.props
    return (
      <div ref={ref => (this.ref = ref)} className="mdc-menu" tabIndex="-1">
        <ul
          style={{ margin: 0 }}
          className="mdc-menu__items mdc-list"
          role="menu"
          aria-hidden="true"
        >
          {children}
        </ul>
      </div>
    )
  }
}

    `,
    },
    {
      title: 'App.js',
      code: `
// @flow
import React, { Component } from 'react'
import { render } from 'react-dom'

import Menu, { Item, Anchor } from './Menu'
import Button from '../Button/Button'

class App extends Component<{}, { open: boolean }> {
  state = {
    open: false,
  }
  render() {
    return (
      <div style={{ height: 150, width: '100%' }}>
        <Anchor>
          <Button
            raised
            onClick={() => this.setState({ open: !this.state.open })}
          >
            Show
          </Button>
          <Menu open={this.state.open}>
            <Item onClick={() => this.setState({ open: false })}>Yolo !</Item>
            <Item onClick={() => this.setState({ open: false })}>Yolo !</Item>
          </Menu>
        </Anchor>
      </div>
    )
  }
}

render(App, document.getElementById('root'))
       `,
    },
  ],
};

export default Elements.add('Menu', () => <DocPage {...documentation} material />);
