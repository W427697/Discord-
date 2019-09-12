/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types'

export const Button = ({ label, isLink }) => {
  if(isLink) {
    return <a>{label}</a>
  }
  return <button>{label}</button>
};

Button.propTypes = {
  label: PropTypes.string,
  isLink: PropTypes.bool,
}