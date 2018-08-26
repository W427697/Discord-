import fs from 'fs';
import path from 'path';
import injectDecorator from './inject-decorator';

describe('inject-decorator', () => {
  describe('positive', () => {
    const mockFilePath = './__mocks__/inject-decorator.stories.txt';
    const source = fs.readFileSync(mockFilePath, 'utf-8');
    const result = injectDecorator(source, path.resolve(__dirname, mockFilePath), {
      parser: 'javascript',
    });

    it('injects stories decorator as a window.__STORYBOOK_CLIENT_API__.addDecorator', () => {
      expect(result).toMatchSnapshot();
    });
  });

  describe('positive - angular', () => {
    const mockFilePath = './__mocks__/inject-decorator.angular-stories.txt';
    const source = fs.readFileSync(mockFilePath, 'utf-8');
    const result = injectDecorator(source, path.resolve(__dirname, mockFilePath), {
      parser: 'typescript',
    });

    it('injects stories decorator as a window.__STORYBOOK_CLIENT_API__.addDecorator', () => {
      expect(result).toMatchSnapshot();
    });
  });

  describe('positive - ts', () => {
    const mockFilePath = './__mocks__/inject-decorator.ts.txt';
    const source = fs.readFileSync(mockFilePath, 'utf-8');
    const result = injectDecorator(source, path.resolve(__dirname, mockFilePath), {
      parser: 'typescript',
    });

    it('injects stories decorator as a window.__STORYBOOK_CLIENT_API__.addDecorator', () => {
      expect(result).toMatchSnapshot();
    });
  });

  it('will not change the source when there are no "storiesOf" functions', () => {
    const mockFilePath = './__mocks__/inject-decorator.no-stories.txt';
    const source = fs.readFileSync(mockFilePath, 'utf-8');

    const result = injectDecorator(source, path.resolve(__dirname, mockFilePath), {
      parser: 'javascript',
    });

    expect(result).toEqual(source);
  });
});
