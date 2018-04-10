// @flow
import React from 'react';
import SearchBar from '@ied/search-bar';

import { version } from '@ied/search-bar/package.json';
import { action } from '@storybook/addon-actions';

import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const component = {
  name: 'Search-Bar',
  description: 'A component that represents a search-bar',
  version,
  usage: `
import SearchBar from '@ied/search-bar'

<SearchBar onChange={() => {}} placeholder="May the Force be with you..." />
<SearchBar onChange={() => {}} placeholder="Search on the dark side of the Force..." dark />
`,
  component: (
    <div style={{ width: '100%', padding: '0 20px' }}>
      <SearchBar
        onChange={e => {
          action('Light SearchBar');
        }}
        placeholder="May the Force be with you..."
      />
      <div style={{ height: 20 }} />
      <SearchBar
        onChange={e => {
          action('Dark SearchBar')('Value', e.target.value);
        }}
        placeholder="Search on the dark side of the Force..."
        dark
      />
    </div>
  ),
  props: [
    { name: 'onChange', type: '(value: string) => void', required: true },
    { name: 'placeholder', type: 'string', required: false },
    { name: 'autoFocus', type: 'boolean', required: false },
    { name: 'dark', type: 'boolean', required: false },
  ],
};

export default Elements.add('SearchBar', () => <DocPage {...component} />);
