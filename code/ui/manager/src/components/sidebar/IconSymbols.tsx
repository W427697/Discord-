import { styled } from '@storybook/theming';
import type { FC } from 'react';
import React from 'react';

const Svg = styled.svg`
  position: absolute;
  width: 0;
  height: 0;
  display: inline-block;
  shape-rendering: inherit;
  vertical-align: middle;
`;

// We are importing the icons from @storybook/icons as we need to add symbols inside of them.
// This will allow to set icons once and use them everywhere.

const NESTED_GROUP_ID = 'icon--group--nested';
const GROUP_ID = 'icon--group';
const NESTED_COMPONENT_ID = 'icon--component';
const COMPONENT_ID = 'icon--component--nested';
const DOCUMENT_ID = 'icon--document';
const STORY_ID = 'icon--story';

// For now the nested groups/components remain with the same icon as the group/components themselves.

export const IconSymbols: FC = () => {
  return (
    <Svg data-chromatic="ignore">
      <symbol id={NESTED_GROUP_ID}>
        {/* https://github.com/storybookjs/icons/blob/main/src/icons/Category.tsx */}
        <path
          d="M3 1.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zM2 3.504a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 5.5a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-7zM2 12V6h10v6H2z"
          fill="currentColor"
        />
      </symbol>
      <symbol id={GROUP_ID}>
        {/* https://github.com/storybookjs/icons/blob/main/src/icons/Folder.tsx */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.586 3.504l-1.5-1.5H1v9h12v-7.5H6.586zm.414-1L5.793 1.297a1 1 0 00-.707-.293H.5a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-8.5a.5.5 0 00-.5-.5H7z"
          fill="currentColor"
        />
      </symbol>
      <symbol id={NESTED_COMPONENT_ID}>
        {/* https://github.com/storybookjs/icons/blob/main/src/icons/Component.tsx */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5098 5.01L14.5498 3.05C13.1498 1.65 10.8498 1.65 9.44977 3.05L7.48977 5.01C7.09977 5.4 7.09977 6.04 7.48977 6.43L11.2998 10.24C11.6898 10.63 12.3198 10.63 12.7098 10.24L16.5198 6.43C16.8998 6.04 16.8998 5.4 16.5098 5.01Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.01 7.49172L3.05 9.45172C1.65 10.8517 1.65 13.1517 3.05 14.5517L5.01 16.5117C5.4 16.9017 6.03 16.9017 6.42 16.5117L10.23 12.7017C10.62 12.3117 10.62 11.6817 10.23 11.2917L6.43 7.49172C6.04 7.10172 5.4 7.10172 5.01 7.49172Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.9491 9.45172L18.9891 7.49172C18.5991 7.10172 17.9691 7.10172 17.5791 7.49172L13.7691 11.3017C13.3791 11.6917 13.3791 12.3217 13.7691 12.7117L17.5791 16.5217C17.9691 16.9117 18.5991 16.9117 18.9891 16.5217L20.9491 14.5617C22.3491 13.1517 22.3491 10.8517 20.9491 9.45172Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.48907 18.9891L9.44907 20.9491C10.8491 22.3491 13.1491 22.3491 14.5491 20.9491L16.5091 18.9891C16.8991 18.5991 16.8991 17.9691 16.5091 17.5791L12.6991 13.7691C12.3091 13.3791 11.6791 13.3791 11.2891 13.7691L7.47907 17.5791C7.09907 17.9591 7.09907 18.5991 7.48907 18.9891Z"
          fill="currentColor"
        />
      </symbol>
      <symbol id={COMPONENT_ID}>
        {/* https://github.com/storybookjs/icons/blob/main/src/icons/Component.tsx */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.5 1.004a2.5 2.5 0 00-2.5 2.5v7a2.5 2.5 0 002.5 2.5h7a2.5 2.5 0 002.5-2.5v-7a2.5 2.5 0 00-2.5-2.5h-7zm8.5 5.5H7.5v-4.5h3a1.5 1.5 0 011.5 1.5v3zm0 1v3a1.5 1.5 0 01-1.5 1.5h-3v-4.5H12zm-5.5 4.5v-4.5H2v3a1.5 1.5 0 001.5 1.5h3zM2 6.504h4.5v-4.5h-3a1.5 1.5 0 00-1.5 1.5v3z"
          fill="currentColor"
        />
      </symbol>
      <symbol id={DOCUMENT_ID}>
        {/* https://github.com/storybookjs/icons/blob/main/src/icons/Document.tsx */}
        <path
          d="M4 5.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zM4.5 7.5a.5.5 0 000 1h5a.5.5 0 000-1h-5zM4 10.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.5 0a.5.5 0 00-.5.5v13a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V3.207a.5.5 0 00-.146-.353L10.146.146A.5.5 0 009.793 0H1.5zM2 1h7.5v2a.5.5 0 00.5.5h2V13H2V1z"
          fill="currentColor"
        />
      </symbol>
      <symbol id={STORY_ID}>
        {/* https://github.com/storybookjs/icons/blob/main/src/icons/BookmarkHollow.tsx */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.5 0h7a.5.5 0 01.5.5v13a.5.5 0 01-.454.498.462.462 0 01-.371-.118L7 11.159l-3.175 2.72a.46.46 0 01-.379.118A.5.5 0 013 13.5V.5a.5.5 0 01.5-.5zM4 12.413l2.664-2.284a.454.454 0 01.377-.128.498.498 0 01.284.12L10 12.412V1H4v11.413z"
          fill="currentColor"
        />
      </symbol>
    </Svg>
  );
};

export const UseSymbol: FC<{ type: 'group' | 'nested_group' | 'component' | 'nested_component' | 'document' | 'story' }> = ({ type }) => {
  if (type === 'group') return <use xlinkHref={`#${GROUP_ID}`} />;
  if (type === 'nested_group') return <use xlinkHref={`#${NESTED_GROUP_ID}`} />;
  if (type === 'component') return <use xlinkHref={`#${COMPONENT_ID}`} />;
  if (type === 'nested_component') return <use xlinkHref={`#${NESTED_COMPONENT_ID}`} />;
  if (type === 'document') return <use xlinkHref={`#${DOCUMENT_ID}`} />;
  if (type === 'story') return <use xlinkHref={`#${STORY_ID}`} />;
  return null;
};
