import { Story } from '@storybook/store';

import { getSnippet } from './getSnippet';
import { SourceType } from '../shared';

const snippet = 'snippet';

describe('addon-docs getSnippet', () => {
  it('should return snippet when there is no story.', () => {
    expect(getSnippet(snippet)).toBe(snippet);
  });

  it('should return user defined code when it exists.', () => {
    const userDefinedCode = 'user-defined-code';
    const story: Story<any> = ({
      parameters: {
        docs: {
          source: {
            code: userDefinedCode,
          },
        },
      },
    } as unknown) as Story<any>;
    expect(getSnippet(snippet, story)).toBe(userDefinedCode);
  });

  describe('dynamic source type', () => {
    it('should return snippet when transformSource does not exist.', () => {
      const story: Story<any> = ({
        parameters: {
          docs: {
            source: {
              type: SourceType.DYNAMIC,
            },
          },
        },
      } as unknown) as Story<any>;
      expect(getSnippet('', story)).toBe('');
    });

    it('should transform snippet when transformSource exists.', () => {
      const story: Story<any> = ({
        parameters: {
          docs: {
            transformSource: (val: string) => `${val}-transformed`,
            source: {
              type: SourceType.DYNAMIC,
            },
          },
        },
      } as unknown) as Story<any>;
      expect(getSnippet(snippet, story)).toBe(`${snippet}-transformed`);
    });
  });
});
