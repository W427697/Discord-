import React from 'react';
import LogoUrl from '../../assets/inextensodigital/logo.png';
import { Introduction } from '../Categories';
import { Header, Brand, Logo } from './Styled';

export default Introduction.add('About us', () => (
  <div>
    <Header>
      <Brand>
        <Logo src={LogoUrl} alt="In extenso Digital" />
        <h2>Work in progress ...</h2>
      </Brand>
    </Header>
  </div>
));
