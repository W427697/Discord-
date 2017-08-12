import React from 'react';
import PropTypes from 'prop-types';
import EmptyPanel from './empty_panel';

const styles = {
  main: {
    width: '100%',
    padding: 0,
    backgroundColor: '#ededed',
  },
};

const InfoPanel = ({ infoString }) => {
  if (!infoString) {
    return <EmptyPanel />;
  }
  const infoMarkup = {
    __html: infoString,
  };

  return <div style={styles.main} dangerouslySetInnerHTML={infoMarkup} />;
};

InfoPanel.propTypes = {
  infoString: PropTypes.string,
};

InfoPanel.defaultProps = {
  infoString: null,
};

export default InfoPanel;
