import React from 'react';
import PropTypes from 'prop-types';
import EmptyPanel from './empty_panel';

/* select one from src/components/markdown/hljs-styles/
   check out the appearance before in https://highlightjs.org/
   some dark styles are: androidstudio, rainbow, ocean
   some light styles are: github, tomorrow, default
*/
import '../components/markdown/hljs-styles/github.css';

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

  return <div style={styles.main} dangerouslySetInnerHTML={infoMarkup} />; // eslint-disable-line
};

InfoPanel.propTypes = {
  infoString: PropTypes.string,
};

InfoPanel.defaultProps = {
  infoString: null,
};

export default InfoPanel;
