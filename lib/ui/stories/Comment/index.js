// @flow
import React, { Fragment } from 'react';
import Comment from '@ied/comment';
import { version } from '@ied/comment/package.json';
import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const comment = {
  name: 'Comment',
  description: 'A component that represents a comment',
  version,
  usage: `
import Comment from '@ied/comment'

<Comment text="Lorem ipsum dolor sit amet, consectetur adipisicing elit..." />
<Comment text="Lorem ipsum dolor sit amet, consectetur adipisicing elit." compact />
  `,
  component: (
    <Fragment>
      <Comment
        style={{ margin: '0 20px' }}
        text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, officiis, aliquid. Eligendi dolorem sapiente, atque odit hic eum. Fugiat iste distinctio fuga expedita quaerat labore quos id ratione. Impedit, praesentium."
      />
      <Comment text="Lorem ipsum dolor sit amet, consectetur adipisicing elit." compact />
    </Fragment>
  ),
  props: [
    { name: 'text', type: 'string', required: true },
    { name: 'compact', type: 'boolean', required: false },
  ],
};

export default Elements.add('Comment', () => <DocPage {...comment} />);
