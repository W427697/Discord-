// @flow
import React, { Component } from 'react';
import { MDCMenu, Corner } from '@material/menu/dist/mdc.menu.min';
import '@material/list/dist/mdc.list.min.css';
import '@material/menu/dist/mdc.menu.min.css';

type ItemType = React$StatelessFunctionalComponent<{
  children: React$Node,
  className?: string,
  style?: {},
  onClick?: (e: Event) => void,
}>;

export const Item: ItemType = ({ children, className, style, onClick }) => (
  <li
    className={`${className || ''} mdc-list-item`}
    role="menuitem"
    tabIndex="0"
    style={style}
    onClick={onClick}
  >
    {children}
  </li>
);

type AnchorType = React$StatelessFunctionalComponent<{
  className?: string,
}>;

export const Anchor: AnchorType = ({ className, ...props }) => (
  <div {...props} className={`${className || ''} mdc-menu-anchor`} />
);

type Props = {
  open: boolean,
  children: React$Element<ItemType> | React$ChildrenArray<ItemType>,
};

export default class Menu extends Component<Props> {
  componentDidMount = () => {
    if (this.ref) {
      this.menu = new MDCMenu(this.ref);
      this.menu.foundation_.adapter_.registerBodyClickHandler = () => {};
      this.menu.foundation_.adapter_.deregisterBodyClickHandler = () => {};
      this.menu.setAnchorCorner(Corner.BOTTOM_START);
    }
  };
  componentWillReceiveProps = (nextProps: Props) => {
    this.menu.open = nextProps.open;
  };

  menu: MDCMenu;
  ref: ?HTMLDivElement;
  render() {
    const { children } = this.props;
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
    );
  }
}
