import React from 'react';
import PropTypes from 'prop-types';
import { Section, InfoContent, Content } from './Styled';

const Info = ({ name, version }) => (
  <Section>
    <Content>
      <InfoContent>
        <li>
          <span>Install</span>
          <span>{`yarn add @ied/${name.toLowerCase()}`}</span>
        </li>
        <li>
          <span>
            <img height="22" src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/npm.svg" />
          </span>
          <span>
            <a
              href={`https://www.npmjs.com/package/@ied/${name.toLowerCase()}`}
            >{`@ied/${name.toLowerCase()}`}</a>
          </span>
        </li>
        <li>
          <span>
            <img
              height="16"
              src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg"
            />
          </span>
          <span>
            <a
              href={`https://github.com/inextensodigital/components/tree/master/${name.toLowerCase()}`}
            >
              Github
            </a>
          </span>
        </li>
        <li>
          <span>Version</span>
          <span>{version}</span>
        </li>
      </InfoContent>
    </Content>
  </Section>
);

Info.defaultProps = {
  name: '',
  version: '',
};

Info.propTypes = {
  name: PropTypes.string,
  version: PropTypes.string,
};

export default Info;
