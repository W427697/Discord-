/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types'

export const Button = ({ label, isLink, isLoading, ...rest }) => {
  let displayLabel = label;
  console.log(rest)
  if(isLoading) {
    displayLabel = '...';
  }
  if(isLink) {
    return <a {...rest}>{displayLabel}</a>
  }
  return <button {...rest}>{displayLabel}</button>
};
