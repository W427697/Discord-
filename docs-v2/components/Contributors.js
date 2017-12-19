import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import { Logos, Icons } from '@storybook/components';

import Container from './Container';
import { H2 } from './Markdown';

const { Npm } = Logos;
const { Github, Twitter } = Icons;

const Item = glamorous.li({
  listStyle: 'none',
  display: 'inline-block',
  padding: '0 10px',
  position: 'relative',
  marginBottom: 10,
  width: 80,
  boxSizing: 'border-box',

  '@media screen and (max-width: 500px)': {
    width: '25%',
  },
  '@media screen and (max-width: 400px)': {
    width: '50%',
  },
});

const List = glamorous.ul({
  listStyle: 'none',
  padding: 0,
  margin: '0 -10px',
  display: 'flex',
  flexFlow: 'row wrap',
});

const Image = glamorous.img({
  width: '100%',
  height: 'auto',
  borderRadius: '50%',
  boxShadow: '0 0 0 4px rgba(0,0,0,0)',
  transition: 'box-shadow .3s linear',
  '&:hover': {
    boxShadow: '0 0 0 4px rgba(0,0,0,0.1)',
  },
});

const Name = glamorous.p({
  width: '100%',
  margin: 0,
  textAlign: 'center',
  fontSize: 10,
  marginBottom: 5,
});

const Socials = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: -3,
  marginBottom: 5,
  '& > *': {
    flex: '1',
    padding: 3,
    borderRadius: '50%',
    lineHeight: 0,
    color: 'black',
  },
});

const gradients = {
  blue: 'linear-gradient(135deg, #2ab5bb 8%, #2a7bbb)',
};

const Contributors = ({ items }) =>
  items.length ? (
    <Container width={1080} vPadding={40} background={gradients.blue}>
      <H2>This document was created by these people:</H2>
      <List>
        {items.map(item => (
          <Item>
            <Image src={`https://www.gravatar.com/avatar/${item.hash}`} />
            <Name>{item.name}</Name>
            {item.meta ? (
              <Socials>
                {item.meta.npm ? (
                  <a href={`https://npmjs.com/~${item.meta.npm}`}>
                    <Npm />
                  </a>
                ) : null}
                {item.meta.github ? (
                  <a href={`https://github.com/${item.meta.github}`}>
                    <Github />
                  </a>
                ) : null}
                {item.meta.twitter ? (
                  <a href={`https://twitter.com/${item.meta.twitter}`}>
                    <Twitter />
                  </a>
                ) : null}
              </Socials>
            ) : null}
          </Item>
        ))}
      </List>
    </Container>
  ) : null;
Contributors.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      hash: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
};

export default Contributors;
