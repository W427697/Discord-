import React, { Fragment, Component } from 'react';
import PropsTypes from 'prop-types';
import { coy } from 'react-syntax-highlighter/styles/prism';
import Example from './Example';

import {
  Section,
  SectionTitle,
  SectionSubTitle,
  CodeContent,
  Content,
  Expander,
  Pills,
} from './Styled';

class CodeViewerMaterial extends Component {
  state = {
    active: {},
    expanderHeight: [],
  };
  componentDidMount = () => {
    this.setState({
      active: this.expanders.reduce((r, v, i) => ({ ...r, [i]: 1 }), {}),
      expanderHeight: this.expanders.map(v => v.clientHeight),
    });
  };
  expanders = [];

  render() {
    const { active, expanderHeight } = this.state;
    const { usages } = this.props;
    return (
      <Section>
        <Content>
          <SectionTitle>
            <Pills>code</Pills>Code{' '}
          </SectionTitle>
          {console.log(usages)}
          {usages.map((v, i) => (
            <Fragment key={v.title}>
              {v.title && (
                <SectionSubTitle
                  onClick={() =>
                    this.setState({
                      active: { ...active, [i]: active[i] ? 0 : 1 },
                    })
                  }
                >
                  <Pills>insert_drive_file</Pills>
                  {v.title}
                  <Pills active={active[i]}>keyboard_arrow_down</Pills>
                </SectionSubTitle>
              )}

              <Expander
                height={expanderHeight[i]}
                active={active[i]}
                innerRef={e => (this.expanders[i] = e)}
              >
                <CodeContent language={v.type || 'jsx'} style={coy} material={1}>
                  {v.code}
                </CodeContent>
                {v.example && <Example component={v.example} />}
              </Expander>
            </Fragment>
          ))}
        </Content>
      </Section>
    );
  }
}

CodeViewerMaterial.defaultProps = {
  usages: [],
};

CodeViewerMaterial.propTypes = {
  usages: PropsTypes.arrayOf(PropsTypes.shape({})),
};

export default CodeViewerMaterial;
