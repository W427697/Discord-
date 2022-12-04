import React from 'react'
import * as ReactDOMServer from 'react-dom/server';
import * as reactAnnotations from '@storybook/react/preview';
import { Title, ExternalDocs } from '@storybook/blocks'

const element = React.createElement(
  ExternalDocs,
  { projectAnnotationsList: [reactAnnotations] },
  React.createElement(Title, {}, 'Title content')
);

console.log(ReactDOMServer.renderToString(element));
