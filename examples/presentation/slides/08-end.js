import React from 'react';
import { storiesOf, forceReRender } from '@storybook/react';

import { Spaced, Logo } from '@storybook/components';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import WrappingInline from '../components/layout/wrapping-inline';
import Avatar from '../components/avatar';
import Hr from '../components/hr';
import Link from '../components/link';

storiesOf('Slides|end', module)
  .add('add your own features', () => (
    <TitlePage>
      <center>
        <Logo colored width="200" />
      </center>
      <br />
      <Heading type="main" mods={['centered']}>
        open source
      </Heading>
      <Hr />
      <Heading type="main" mods={['centered']}>
        We welcome your input and help
      </Heading>
    </TitlePage>
  ))
  .add('communities', () => (
    <TitlePage>
      <center>
        <Logo colored width="200" />
      </center>
      <br />
      <Heading type="sub" mods={['centered']}>
        we support many frameworks
      </Heading>
      <Hr />
      <Heading type="main" mods={['centered']}>
        We're trying to build a tool for all UI developers
      </Heading>
      <Hr />
      <Heading type="sub" mods={['centered']}>
        and accessible for non-technical team members
      </Heading>
    </TitlePage>
  ))
  .add('thanks to the community', () => {
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
                  .sort(() => (Math.random() > 0.5 ? 1 : -1))
                  .map(p => (
                    <Avatar size={3} src={p} />
                  ))}
              </WrappingInline>
            </div>
          </Spaced>
        </Spaced>
      </TitlePage>
    );
  })
  .add('thanks', () => (
    <TitlePage>
      <Heading type="mega" mods={['centered']}>
        👋
      </Heading>
      <Heading type="main">Thank you for your time!</Heading>
      <Hr />
      <center>
        <Link href="http://v.ht/grommet">http://v.ht/grommet</Link>
      </center>
    </TitlePage>
  ));
