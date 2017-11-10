import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const gradients = {
  blue: 'linear-gradient(135deg, #2ab5bb 8%, #2a7bbb)',
  pink: 'linear-gradient(135deg, rgb(241,97,140) 0%, rgb(181,126,229) 100%)',
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
    '@media screen and (min-width: 900px)': {
      '& h1': {
        // float: 'left',
        // maxWidth: '40vw',
        // marginRight: 50,
      },
      '& p:first-of-type': {
        marginTop: 0,
      },
    },
  },
  ({ minHeight = '60vh' }) => ({
    minHeight,
  })
);

const PageTitle = ({ children, ...rest }) => (
  <Root {...rest}>
    <div>{children}</div>
  </Root>
);

PageTitle.displayName = 'PageTitle';
PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageTitle;
