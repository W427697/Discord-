import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import { Section, SectionTitle, ExampleContent, Content, Expander, Pills } from './Styled';

class Example extends Component {
  state = {
    active: 1,
    expanderHeight: 0,
  };
  componentDidMount = () => {
    this.setState({
      expanderHeight: this.expander.clientHeight,
    });
  };
  render() {
    const { active, expanderHeight } = this.state;
    const { component } = this.props;
    return (
      <Section>
        <Content>
          <SectionTitle onClick={() => this.setState({ active: active ? 0 : 1 })}>
            <Pills>image</Pills>Preview
            <Pills active={active}>keyboard_arrow_down</Pills>
          </SectionTitle>
          <Expander height={expanderHeight} active={active} innerRef={e => (this.expander = e)}>
            <ExampleContent>{component}</ExampleContent>
          </Expander>
        </Content>
      </Section>
    );
  }
}

Example.defaultProps = {
  component: {},
};

Example.propTypes = {
  component: PropsTypes.node,
};

export default Example;
