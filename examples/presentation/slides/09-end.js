import React from 'react';
import { forceReRender } from '@storybook/react';

import { Spaced } from '@storybook/components';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import WrappingInline from '../components/layout/wrapping-inline';
import Avatar from '../components/avatar';
import Hr from '../components/hr';
import Link from '../components/link';

export default {
  title: 'Slides|end',
};

export const thanksToTheCommunity = () => {
  const pictures = [];
  const req = require.context('../other/team', true, /\.(jpg|png)$/);
  req.keys().forEach(filename => pictures.push(req(filename)));

  return (
    <TitlePage>
      <Spaced>
        <Heading type="mega" mods={['centered']}>
          🙇‍
        </Heading>
        <Spaced row={2}>
          <div>
            <WrappingInline align="center" onClick={() => forceReRender()}>
              {pictures
                .slice(0, 12)
                .sort(() => (Math.random() > 0.5 ? 1 : -1))
                .map(p => (
                  <Avatar size={3} src={p} />
                ))}
            </WrappingInline>
          </div>

          <Heading type="main" mods={['centered']}>
            Thank you for your absolute awesomeness!
          </Heading>
          <div>
            <WrappingInline align="center" onClick={() => forceReRender()}>
              {pictures
                .slice(12)
                .sort((a, b) => (Math.random() > 0.5 ? 1 : -1))
                .map(p => (
                  <Avatar size={3} src={p} />
                ))}
            </WrappingInline>
          </div>
        </Spaced>
      </Spaced>
    </TitlePage>
  );
};

thanksToTheCommunity.story = {
  name: 'thanks to the community',
};

export const thanks = () => (
  <TitlePage>
    <Heading type="mega" mods={['centered']}>
      👋
    </Heading>
    <Heading type="main">Thank you for your time!</Heading>
    <Hr />
    <center>
      <Link href="http://v.ht/reactnext">http://v.ht/reactnext</Link>
    </center>
  </TitlePage>
);

thanks.story = {
  name: 'thanks',
};
