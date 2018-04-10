import React, { Component } from 'react';
import PropTypes from 'prop-types';
import polyfill from 'react-lifecycles-compat';
import { Container, Item, Header } from './Styled';

class Tree extends Component {
  tree = () => {
    const { data, onToggle } = this.props;
    return (
      data &&
      data.children.reduce((ac, child) => {
        if (child.name === ' ' && child.children.length > 0) {
          return [
            ...ac,
            ...child.children.map(v => (
              <Item key={v.name} onClick={() => onToggle(v, true)} active={v.active}>
                {v.name}
              </Item>
            )),
          ];
        }
        return ac;
      }, [])
    );
  };

  render() {
    return (
      <Container>
        <Header>{this.props.headerName}</Header>
        {this.tree()}
      </Container>
    );
  }
}

Tree.defaultProps = {
  data: null,
  headerName: null,
  onToggle: null,
};
Tree.propTypes = {
  data: PropTypes.shape({}),
  headerName: PropTypes.string,
  onToggle: PropTypes.func,
};

polyfill(Tree);

export default Tree;
