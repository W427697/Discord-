import React, { Component } from 'react';
import Badge from '@ied/badge';
import { setOptions } from '@storybook/addon-options';
import { Container } from './Styled';
import Header from './Header';
import Info from './Info';
import InfoMaterial from './InfoMaterial';
import CodeViewer from './CodeViewer';
import CodeViewerMaterial from './CodeViewer';
import Example from './Example';
import Props from './Props';
import Requirement from './Requirement';

export default class DocPage extends Component {
  componentDidMount() {
    document.body.scrollTop = 0;
    setOptions({ showAddonPanel: false });
  }

  render = () => {
    const {
      name,
      description,
      version,
      usage,
      component,
      props,
      requirement,
      material,
    } = this.props;
    return (
      <Container>
        <Header name={name} description={description} />
        {material ? (
          <InfoMaterial name={name} version={version} />
        ) : (
          <Info name={name} version={version} />
        )}
        {component && <Example component={component} />}
        <Requirement usage={requirement} />
        <CodeViewer usages={[...usage]} material={material} />

        {props && <Props props={props} />}
      </Container>
    );
  };
}
