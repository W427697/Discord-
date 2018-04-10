// @flow
import React, { Component } from 'react';
import { action } from '@storybook/addon-actions';

import Menu, { Item, Anchor } from './Menu';
import Button from '../Button/Button';

class Example extends Component<{}, { open: boolean }> {
  state = {
    open: false,
  };
  render() {
    return (
      <div style={{ height: 150, width: '100%' }}>
        <Anchor>
          <Button
            raised
            onClick={() => {
              this.setState({ open: !this.state.open }, () => {
                action('Menu open')('open', this.state.open);
              });
            }}
          >
            Show
          </Button>
          <Menu open={this.state.open}>
            <Item
              onClick={() => {
                action('Item selected')('index 1');
                this.setState({ open: false });
              }}
            >
              Yolo !
            </Item>
            <Item
              onClick={() => {
                action('Item selected')('index 2');
                this.setState({ open: false });
              }}
            >
              Yolo !
            </Item>
          </Menu>
        </Anchor>
      </div>
    );
  }
}

export default Example;
