import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
// import glamorous from 'glamorous';
import { localStorage, window, CustomEvent } from 'global';
import glamorous from 'glamorous';

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
    return { content: regularList };
  }
  const closestMatchingType = getClosestMatchingType(getTypes(children), selected);
  const closestList = Children.toArray(children).reduce(
    (acc, item) => acc.concat(item.props.framework === closestMatchingType ? item : []),
    []
  );

  return {
    message: (
      <span>
        there's no code-example for <strong>{selected}</strong>, displaying example for
      </span>
    ),
    content: closestList,
    value: closestMatchingType,
  };
};

const Select = glamorous(({ items, onChange, value, className, title }) => (
  <div className={className}>
    {value}
    <select {...{ onChange, value, title, 'aria-label': title }}>
      {items.map(item => (
        <option value={item} key={item}>
          {item}
        </option>
      ))}
    </select>
  </div>
))({
  height: 24,
  lineHeight: '24px',
  display: 'inline-block',
  position: 'relative',
  borderRadius: '0 4px 0 0',
  padding: '0 5px',
  color: 'white',
  fontWeight: 600,
  '& select': {
    cursor: 'pointer',
    border: '0 none',
    position: 'absolute',
    appearance: 'button',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    color: 'transparent',
    background: 'transparent',
  },
});
Select.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

const Figure = glamorous.figure({
  color: 'currentColor',
  fontWeight: 'normal',
  fontSize: 15,
  marginTop: 0,
  padding: 0,
  marginLeft: 0,
  marginRight: 0,
  marginBottom: '1.2em',
  lineHeight: '1.4em',
});

const Message = glamorous.div({
  color: '#f26060',
  lineHeight: '24px',
  fontSize: 13,
  display: 'inline',
  paddingLeft: 6,
  fontWeight: 300,
});
const Filename = glamorous.figcaption({
  color: 'gray',
  fontSize: 13,
  lineHeight: '24px',
  paddingLeft: 8,
  paddingRight: 8,
  float: 'left',
  fontStyle: 'italic',
});

const Toolbar = glamorous(
  ({ selected, value, types, message, filename, className }) =>
    filename || types.length > 1 ? (
      <div className={className} role="toolbar">
        {filename ? <Filename title="Filename">{filename}</Filename> : null}
        <span />
        {types.length > 1 ? (
          <div style={{ float: 'right', textAlign: 'right' }}>
            <Message>{message}</Message>
            <Select
              value={value || selected}
              items={types}
              onChange={event => setSelected(event.target.value)}
              title="change the code example to a different framework"
            />
          </div>
        ) : null}
      </div>
    ) : null
)({
  marginBottom: -6,
  background: '#141414',
  paddingBottom: 7,
  borderRadius: 4,
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
});

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
    const { children } = this.props;
    const types = getTypes(children);
    const { content, message, value } = getContent(children, selected);
    const { filename } = content[0].props;

    return (
      <Figure>
        <Toolbar {...{ selected, value, types, message, filename }} />
        {content}
      </Figure>
    );
  }
}
CodeSwitcher.displayName = 'Markdown.CodeSwitcher';
CodeSwitcher.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CodeSwitcher as default };
