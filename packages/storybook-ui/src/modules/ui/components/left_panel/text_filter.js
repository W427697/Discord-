import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '../theme';

const mainStyle = {
  ...baseFonts,
  border: '1px solid #ECECEC',
  borderRadius: 2,
  position: 'relative',
  marginBottom: '10px',
};

const textWrapStyle = {
  background: '#F7F7F7',
};

const textStyle = {
  fontSize: '1rem',
  color: '#828282',
  padding: 5,
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  border: 0,
  height: '2rem',
};

const clearButtonStyle = {
  position: 'absolute',
  color: '#868686',
  border: 'none',
  width: 25,
  height: '2rem',
  right: 1,
  top: 0,
  textAlign: 'center',
  cursor: 'pointer',
  lineHeight: '30px',
  fontSize: '25px',
  textDecoration: 'none'
};

export default class TextFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
    };

    this.onChange = this.onChange.bind(this);
    this.fireOnClear = this.fireOnClear.bind(this);
  }

  onChange(event) {
    const text = event.target.value;
    this.setState({ query: text });
    const { onChange } = this.props;
    if (onChange) onChange(text);
  }

  fireOnClear() {
    this.setState({ query: '' });

    const { onClear } = this.props;
    if (onClear) onClear();
  }

  render() {
    return (
      <div style={mainStyle}>
        <div style={textWrapStyle}>
          <input
            id="storyFilter"
            style={textStyle}
            type="text"
            placeholder="Filter"
            name="filter-text"
            value={this.props.text || ''}
            onChange={this.onChange}
          />
        </div>
        {this.state.query &&
          this.state.query.length &&
          <a 
            href="#storyFilter" 
            aria-label="clear filter"
            style={clearButtonStyle}
            onClick={this.fireOnClear}
            className="clear"
          >
            ×
          </a>}
      </div>
    );
  }
}

TextFilter.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
};
