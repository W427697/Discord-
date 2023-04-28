import { styled } from '@junk-temporary-prototypes/theming';
import type { CSSObject } from '@junk-temporary-prototypes/theming';
import { withReset, withMargin } from '../lib/common';

const listCommon: CSSObject = {
  paddingLeft: 30,
  '& :first-of-type': {
    marginTop: 0,
  },
  '& :last-child': {
    marginBottom: 0,
  },
};

export const OL = styled.ol(withReset, withMargin, { ...listCommon, listStyle: 'decimal' });
