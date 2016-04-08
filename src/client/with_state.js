import React, { Component, PropTypes } from 'react';

export class WithState extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { handlers } = this.props;
    const child = this.props.children;

    const props = Object.assign({}, this.state);

    for (const act of Object.keys(handlers)) {
      const prop = handlers[act];
      props[act] = (v) => {
        if (typeof(child.props[act]) === 'function') {
          child.props[act](v);
        }
        this.setState({ [prop]: v });
      };
    }
    return React.cloneElement(child, props);
  }

}


WithState.propTypes = {
  handlers: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
};
