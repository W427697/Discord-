import React, { Children } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';

export const Placeholder = styled.div(({ color, inline }) => ({
  display: inline ? 'inline-flex' : 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 100,
  width: 200,
  border: `4px solid ${color}`,
}));

const globalStyles = `
*, *:before, *:after {
  box-sizing: border-box;
}

body {
  margin: 40px;
  font-family: 'Open Sans', 'sans-serif';
  background-color: #fff;
  color: #444;
}

h1, p {
  margin: 0 0 1em 0;
}

/* no grid support? */
.sidebar {
  float: left;
  width: 19.1489%;
}

.content {
  float: right;
  width: 79.7872%;
}

/* make a grid */
.wrapper {
  max-width: 940px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 10px;
}

.wrapper > * {
  background-color: #444;
  color: #fff;
  border-radius: 5px;
  padding: 20px;
  font-size: 150%;
  /* needed for the floated layout*/
  margin-bottom: 10px;
}

.header, .footer {
  grid-column: 1 / -1;
  /* needed for the floated layout */
  clear: both;
}


/* We need to set the widths used on floated items back to auto, and remove the bottom margin as when we have grid we have gaps. */
@supports (display: grid) {
  .wrapper > * {
    width: auto;
    margin: 0;
  }
}`;

export const PageTemplate = ({ children }) => {
  const [header, sidebar, content, footer] = Children.toArray(children);

  return (
    <div className="wrapper">
      <Global styles={globalStyles} />
      <div className="header">{header}</div>
      <div className="sidebar">{sidebar}</div>
      <div className="content">{content}</div>
      <div className="footer">{footer}</div>
    </div>
  );
};
