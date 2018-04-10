import React from 'react';
import PropTypes from 'prop-types';
import polyfill from 'react-lifecycles-compat';
import debounce from 'lodash.debounce';
import { Container } from './Styled';

const defaultTextValue = '';

const debounceFilterChangeTimeout = 500;

class TextFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onChange = this.onChange.bind(this);
    this.fireOnClear = this.fireOnClear.bind(this);
    this.changeFilter = debounce(this.changeFilter, debounceFilterChangeTimeout);
  }

  onChange(event) {
    const text = event.target.value;
    this.setState({ query: text });
    this.changeFilter(text);
  }

  fireOnClear() {
    this.setState({ query: defaultTextValue });
    const { onClear } = this.props;
    if (onClear) onClear();
  }

  changeFilter(text) {
    const { onChange } = this.props;
    if (onChange) onChange(text);
  }

  render() {
    return (
      <Container value={this.state.query || defaultTextValue}>
        <div>
          <input
            type="text"
            name="filter-text"
            value={this.state.query || defaultTextValue}
            onChange={this.onChange}
          />
          {/* eslint-disable-next-line */}
          <label>Search</label>
        </div>
        {this.state.query &&
          this.state.query.length && <button onClick={this.fireOnClear}>×</button>}
      </Container>
    );
  }
}

TextFilter.getDerivedStateFromProps = ({ text }, { prevText }) => {
  if (text !== prevText) {
    return {
      query: text,
      prevText: text,
    };
  }
  return null;
};

TextFilter.defaultProps = {
  text: defaultTextValue,
  onChange: null,
  onClear: null,
};

TextFilter.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  text: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
};

polyfill(TextFilter);

export default TextFilter;
