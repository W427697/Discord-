import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import { Section, SectionTitle, PropsContent, Content, Expander, Pills } from './Styled';

class Props extends Component {
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
    const { props } = this.props;
    return (
      <Section>
        <Content>
          <SectionTitle onClick={() => this.setState({ active: active ? 0 : 1 })}>
            <Pills>list</Pills>Props
            <Pills active={active}>keyboard_arrow_down</Pills>
          </SectionTitle>
          <Expander height={expanderHeight} active={active} innerRef={e => (this.expander = e)}>
            <PropsContent>
              <tbody>
                {props.map(prop => (
                  <tr key={prop.name}>
                    <td>
                      <span>{prop.name}</span>
                    </td>
                    <td>
                      <span>{prop.type}</span>
                    </td>
                    {prop.required && (
                      <td>
                        <span>required</span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </PropsContent>
          </Expander>
        </Content>
      </Section>
    );
  }
}

Props.defaultProps = {
  props: [],
};

Props.propTypes = {
  props: PropsTypes.arrayOf(PropsTypes.shape({})),
};

export default Props;
