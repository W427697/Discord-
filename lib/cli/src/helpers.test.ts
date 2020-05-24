import fs from 'fs';
import fse from 'fs-extra';

import * as helpers from './helpers';
import { StoryFormat, SupportedLanguage, SupportedFrameworks } from './project_types';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs-extra', () => ({
  copySync: jest.fn(() => ({})),
  ensureDir: jest.fn(() => {}),
}));

jest.mock('path', () => ({
  // make it return just the second path, for easier testing
  resolve: jest.fn((_, p) => p),
}));

jest.mock('./npm_init', () => ({
  npmInit: jest.fn(),
}));

describe('Helpers', () => {
  describe('copyTemplate', () => {
    it(`should fall back to ${StoryFormat.CSF} 
        in case ${StoryFormat.CSF_TYPESCRIPT} is not available`, () => {
      const csfDirectory = `template-${StoryFormat.CSF}/`;
      (fs.existsSync as jest.Mock).mockImplementation((filePath) => {
        return filePath === csfDirectory;
      });
      helpers.copyTemplate('', StoryFormat.CSF_TYPESCRIPT);

      const copySyncSpy = jest.spyOn(fse, 'copySync');
      expect(copySyncSpy).toHaveBeenCalledWith(csfDirectory, expect.anything(), expect.anything());
    });

    it(`should use ${StoryFormat.CSF_TYPESCRIPT} if it is available`, () => {
      const csfDirectory = `template-${StoryFormat.CSF_TYPESCRIPT}/`;
      (fs.existsSync as jest.Mock).mockImplementation((filePath) => {
        return filePath === csfDirectory;
      });
      helpers.copyTemplate('', StoryFormat.CSF_TYPESCRIPT);

      const copySyncSpy = jest.spyOn(fse, 'copySync');
      expect(copySyncSpy).toHaveBeenCalledWith(csfDirectory, expect.anything(), expect.anything());
    });

    it(`should throw an error for unsupported story format`, () => {
      const storyFormat = 'non-existent-format' as StoryFormat;
      const expectedMessage = `Unsupported story format: ${storyFormat}`;
      expect(() => {
        helpers.copyTemplate('', storyFormat);
      }).toThrowError(expectedMessage);
    });
  });

  describe('copyComponents', () => {
    it.each`
      language        | exists   | folder   | expected
      ${'javascript'} | ${true}  | ${'/js'} | ${'/js'}
      ${'typescript'} | ${true}  | ${'/ts'} | ${'/ts'}
      ${'javascript'} | ${false} | ${'/js'} | ${'/'}
      ${'typescript'} | ${false} | ${'/ts'} | ${'/'}
    `(
      `should fallback to $expected when $folder existance is $exists`,
      ({ language, exists, folder, expected }) => {
        const componentDirectory = `framework/react/${folder}`;
        const expectedDirectory = `framework/react/${expected}`;
        (fs.existsSync as jest.Mock).mockImplementation((filePath) => {
          return filePath === componentDirectory && exists;
        });
        helpers.copyComponents('react', language);

        const copySyncSpy = jest.spyOn(fse, 'copySync');
        expect(copySyncSpy).toHaveBeenCalledWith(
          expectedDirectory,
          expect.anything(),
          expect.anything()
        );
      }
    );

    it(`should create a src folder`, () => {
      helpers.copyComponents('react', SupportedLanguage.JAVASCRIPT);
      expect(fse.ensureDir).toHaveBeenCalledWith('./src');
    });

    it(`should throw an error for unsupported framework`, () => {
      const framework = 'unknown framework' as SupportedFrameworks;
      const expectedMessage = `Unsupported framework: ${framework}`;
      expect(() => {
        helpers.copyComponents(framework, SupportedLanguage.JAVASCRIPT);
      }).toThrowError(expectedMessage);
    });
  });
});
