import React from 'react';
import PropTypes from 'prop-types';
import { baseFonts } from './theme';

const wrapperStyles = {
  display: 'block',
  paddingTop: '10px',
  marginBottom: '15px',
  listStyle: 'none',
  fontSize: '18px',
  fontWeight: 'bold',
  ...baseFonts,
};

const iconStyles = {
  float: 'right',
  fontWeight: 'normal',
  fontSize: '150%',
  lineHeight: '0.65',
};

class Collapsible extends React.Component {
  constructor(props) {
    super(props);
    // Collapsible will be closed by default but
    // allows props to be passed in to override initialState
    this.state = { isActive: props.isActive || false };
    this.handleClick = this.handleClick.bind(this);
    this.focusToContent = this.focusToContent.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Allow controlled toggling of active state
    if (nextProps.active !== this.props.active) {
      this.setState({
        isActive: nextProps.active,
      });
    }
  }

  focusToContent() {
    const content = this.collapsibleBody;
    if (content) {
      content.focus();
    }
  }

  handleClick(e) {
    e.preventDefault();
    this.setState(
      {
        isActive: !this.state.isActive,
      },
      this.focusToContent,
    );
    // We will execute any additional onClick handlers that are passed
    // to the component
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  }

  render() {
    const { tagName = 'div', children, title, id = encodeURI(title) } = this.props;
    const { isActive } = this.state;
    const headingStyles = {
      ...wrapperStyles,
      textDecoration: isActive ? 'underline' : 'none',
    };
    const Element = tagName;

    return (
      <Element>
        <a
          href={`#${id}`}
          onClick={this.handleClick}
          aria-label={isActive ? `${title} - hides content` : `${title} - shows more content`}
          style={headingStyles}
        >
          {title}
          <span style={iconStyles}>
            {isActive ? '-' : '+'}
          </span>
        </a>
        {isActive &&
          <div
            id={id}
            ref={c => this.collapsibleBody = c} // eslint-disable-line no-return-assign
            tabIndex="-1"
          >
            {children}
          </div>}
      </Element>
    );
  }
}

Collapsible.propTypes = {
  tagName: PropTypes.string,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Collapsible;
