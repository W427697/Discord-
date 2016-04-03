import React, { PropTypes } from 'react';

/**
 * proxy component
 */

const propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const SizeButton = ({
  type,
  label,
  onClick,
}) => {
  const onClickBtn = () => (onClick(type));

  return (
    <button onClick={onClickBtn}>{label}</button>
  );
};

SizeButton.propTypes = propTypes;

export default SizeButton;
