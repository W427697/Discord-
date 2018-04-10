import React, { Component } from 'react';
import PropsTypes from 'prop-types';

import { coy } from 'react-syntax-highlighter/styles/prism';
import { Section, SectionTitle, CodeContent, Content, Expander, Pills } from './Styled';

class Requirement extends Component {
  state = {
    active: 1,
    expanderHeight: 0,
  };
  componentDidMount = () => {
    if (this.expander) {
      this.setState({
        expanderHeight: this.expander.clientHeight,
      });
    }
  };
  render() {
    const { active, expanderHeight } = this.state;
    const { usage } = this.props;
    return (
      usage && (
        <Section>
          <Content>
            <SectionTitle onClick={() => this.setState({ active: active ? 0 : 1 })}>
              <Pills>warning</Pills>Requirement
              <Pills active={active}>keyboard_arrow_down</Pills>
            </SectionTitle>
            <Expander height={expanderHeight} active={active} innerRef={e => (this.expander = e)}>
              <CodeContent language="html" style={coy}>
                {usage}
              </CodeContent>
            </Expander>
          </Content>
        </Section>
      )
    );
  }
}

Requirement.defaultProps = {
  usage: '',
};

Requirement.propTypes = {
  usage: PropsTypes.string,
};

export default Requirement;
