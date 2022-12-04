const React = require('react');
const ReactDOMServer = require('react-dom/server');
const reactAnnotations = require('@storybook/react/preview');
const { Title, ExternalDocs } = require('@storybook/blocks');


const element = React.createElement(
  ExternalDocs,
  { projectAnnotationsList: [reactAnnotations] },
  React.createElement(Title, {}, 'Title content')
);

console.log(ReactDOMServer.renderToString(element));
