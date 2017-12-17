import React, { Component, Children, Fragment } from 'react';
import PropTypes from 'prop-types';
// import glamorous from 'glamorous';
import { localStorage, window, CustomEvent } from 'global';

const getSelected = list => {
  try {
    // debugger; // eslint-disable-line
    return localStorage.getItem('framework') || list[0];
  } catch (error) {
    return list[0];
  }
};

const setSelected = value => {
  try {
    localStorage.setItem('framework', value);
  } catch (error) {
    //
  }
  try {
    window.dispatchEvent(new CustomEvent('framework-switch', { detail: value }));
  } catch (error) {
    //
  }
};
const getClosestMatchingType = (types, selected) => {
  switch (true) {
    case types.includes(selected): {
      return selected;
    }
    case selected === 'reactnative' && types.includes('react'): {
      return 'react';
    }
    case selected === 'angular' && types.includes('vue'): {
      return 'vue';
    }
    case types.includes('react'): {
      return 'react';
    }
    default: {
      return types[0];
    }
  }
};

const getTypes = children =>
  Children.toArray(children).reduce((acc, item) => acc.concat(item.props.framework), []);

const getContent = (children, selected) => {
  const regularList = Children.toArray(children).reduce(
    (acc, item) => acc.concat(item.props.framework === selected ? item : []),
    []
  );
  if (regularList.length) {
    return regularList;
  }
  const closestMatchingType = getClosestMatchingType(getTypes(children), selected);
  const closestList = Children.toArray(children).reduce(
    (acc, item) => acc.concat(item.props.framework === closestMatchingType ? item : []),
    []
  );

  return (
    <Fragment>
      <div>
        We don't have an code-example for {selected}, display example for {closestMatchingType}
      </div>
      {closestList}
    </Fragment>
  );
};

const Select = ({ items, onChange, value }) => (
  <select onChange={onChange} value={value}>
    {items.map(item => (
      <option value={item} key={item}>
        {item}
      </option>
    ))}
  </select>
);
Select.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

class CodeSwitcher extends Component {
  constructor(props) {
    super(props);

    const types = getTypes(props.children);
    const selected = types[0];

    this.state = {
      selected,
    };
  }
  componentDidMount() {
    window.addEventListener(
      'framework-switch',
      ({ detail }) => this.setState({ selected: detail }),
      false
    );

    const types = getTypes(this.props.children);
    const selected = getSelected(types);

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      selected,
    });
  }
  componentWillReceiveProps(props) {
    const types = getTypes(props.children);
    const selected = getSelected(types);

    this.setState({
      selected,
    });
  }
  render() {
    const { selected } = this.state;
    const { children, className } = this.props;
    const types = getTypes(children);
    const content = getContent(children, selected);

    return (
      <div className={className}>
        {selected}
        {types.length > 1 ? (
          <Select
            value={selected}
            items={types}
            onChange={event => setSelected(event.target.value)}
          />
        ) : null}
        <div>{content}</div>
      </div>
    );
  }
}
CodeSwitcher.displayName = 'Markdown.CodeSwitcher';
CodeSwitcher.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
CodeSwitcher.defaultProps = {
  props: {},
  className: '',
};

export { CodeSwitcher as default };
