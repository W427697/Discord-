import React from 'react';
import PropTypes from 'prop-types';

export default class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switcher: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {}

  render() {
    const { size, backgroundColor, isText } = this.props;

    const buttonStyle = {
      color: 'white',
      border: '2px solid darkgray',
      borderRadius: 8,
      padding: 6 + size,
      paddingTop: 6,
      paddingBottom: 6,
      margin: 20,
      fontSize: size,
      backgroundColor,
      cursor: 'pointer',
    };
    return (
      <button style={buttonStyle} onClick={this.handleClick}>
        {isText ? 'Press me!' : '🚂🚃🚃🚃🚃🚃🚃🚃🚃'}
      </button>
    );
  }
}

Widget.propTypes = {
  size: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  isText: PropTypes.bool,
};

Widget.defaultProps = {
  isText: true,
};
