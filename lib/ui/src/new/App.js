import React from 'react';
import PropTypes from 'prop-types';
import SearchBox from './SearchBox';
import Layout from './Layout';
import ShortcutsHelp from './ShortcutsHelp';

const App = ({ preview }) => {
 console.log(preview);
 return ( <div>
    <Layout
      preview={preview}
      /* leftPanel={() => <LeftPanel />}
        preview={() => <Preview />}
        downPanel={() => <DownPanel />}*/
    />
    <ShortcutsHelp />
    <SearchBox />
  </div>)
};

App.propTypes = {
  preview: PropTypes.element.isRequired,
};

export default App;