import fs from 'fs';
import path from 'path';
import getStorySource from './get-storysource';

describe('get-storysource', () => {
  describe('positive', () => {
    const mockFilePath = './__mocks__/inject-decorator.stories.txt';
    const source = fs.readFileSync(mockFilePath, 'utf-8');
    const result = getStorySource(source, path.resolve(__dirname, mockFilePath), {
      parser: 'javascript',
    });

    it('calculates "adds" map', () => {
      expect(result.addsMap).toMatchSnapshot();
    });
  });

  describe('positive - angular', () => {
    const mockFilePath = './__mocks__/inject-decorator.angular-stories.txt';
    const source = fs.readFileSync(mockFilePath, 'utf-8');
    const result = getStorySource(source, path.resolve(__dirname, mockFilePath), {
      parser: 'typescript',
    });

    it('calculates "adds" map', () => {
      expect(result.addsMap).toMatchSnapshot();
    });
  });

  describe('positive - ts', () => {
    const mockFilePath = './__mocks__/inject-decorator.ts.txt';
    const source = fs.readFileSync(mockFilePath, 'utf-8');
    const result = getStorySource(source, path.resolve(__dirname, mockFilePath), {
      parser: 'typescript',
    });

    it('calculates "adds" map', () => {
      expect(result.addsMap).toMatchSnapshot();
    });
  });

  describe('stories with ugly comments', () => {
    const mockFilePath = './__mocks__/inject-decorator.ugly-comments-stories.txt';
    const source = fs.readFileSync(mockFilePath, 'utf-8');
    const result = getStorySource(source, path.resolve(__dirname, mockFilePath), {
      parser: 'javascript',
    });

    it('should delete ugly comments from the generated story source', () => {
      expect(result.storySource).toMatchSnapshot();
    });
  });

  describe('stories with ugly comments in ts', () => {
    const mockFilePath = './__mocks__/inject-decorator.ts.ugly-comments-stories.txt';
    const source = fs.readFileSync(mockFilePath, 'utf-8');
    const result = getStorySource(source, path.resolve(__dirname, mockFilePath), {
      parser: 'typescript',
    });

    it('should delete ugly comments from the generated story source', () => {
      expect(result.storySource).toMatchSnapshot();
    });
  });

  it('will not return addsMap when there are no "storiesOf" functions', () => {
    const mockFilePath = './__mocks__/inject-decorator.no-stories.txt';
    const source = fs.readFileSync(mockFilePath, 'utf-8');

    const result = getStorySource(source, path.resolve(__dirname, mockFilePath), {
      parser: 'javascript',
    });

    expect(result.addsMap).toEqual({});
  });
});
