import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import Breadcrumb from './Breadcrumb';

const gradients = {
  blue: 'linear-gradient(135deg, #2ab5bb 8%, #2a7bbb)',
  pink: 'linear-gradient(135deg, rgb(241,97,140) 0%, rgb(181,126,229) 100%)',
  gray: 'linear-gradient(135deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0) 100%)',
  orange:
    'linear-gradient(to right, rgba(241,97,97,1) 0%,rgba(243,173,56,1) 100%,rgba(162,224,94,1) 100%)',
  rainbow:
    'linear-gradient(to right, rgba(181,126,229,1) 0%,rgba(241,97,140,1) 37%,rgba(243,173,56,1) 100%)',
};

const Root = glamorous.section(
  {
    position: 'relative',
    zIndex: 1000,
    backgroundColor: '#2ab5bb',
    backgroundImage: gradients.pink,
    padding: 30,
    color: '#fff',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    fontSize: 15,
    overflow: 'hidden',
    lineHeight: 1.2,
    '& h1': {
      fontSize: '3em',
      fontWeight: 200,
      marginTop: 0,
      marginBottom: 20,
    },
  },
  ({ minHeight = '60vh' }) => ({
    minHeight,
  })
);

const PageTitle = ({ children, path = '', ...rest }) => (
  <Fragment>
    <Root {...rest}>
      <div>{children}</div>
    </Root>
    <Breadcrumb input={path} />
  </Fragment>
);

PageTitle.displayName = 'PageTitle';
PageTitle.propTypes = {
  path: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default PageTitle;
