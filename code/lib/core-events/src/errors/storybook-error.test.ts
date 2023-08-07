import { StorybookError } from './storybook-error';

describe('StorybookError', () => {
  class TestError extends StorybookError {
    category = 'TEST_CATEGORY';

    code = 123;

    template() {
      return 'This is a test error.';
    }
  }

  it('should generate the correct error name', () => {
    const error = new TestError();
    expect(error.name).toBe('SB_TEST_CATEGORY_0123');
  });

  it('should generate the correct message without documentation link', () => {
    const error = new TestError();
    const expectedMessage = 'This is a test error.';
    expect(error.message).toBe(expectedMessage);
  });

  it('should generate the correct message with internal documentation link', () => {
    const error = new TestError();
    error.documentation = true;
    const expectedMessage =
      'This is a test error.\n\nMore info: https://storybook.js.org/error/SB_TEST_CATEGORY_0123';
    expect(error.message).toBe(expectedMessage);
  });

  it('should generate the correct message with external documentation link', () => {
    const error = new TestError();
    error.documentation = 'https://example.com/docs/test-error';
    const expectedMessage =
      'This is a test error.\n\nMore info: https://example.com/docs/test-error';
    expect(error.message).toBe(expectedMessage);
  });

  it('should have default telemetry value of false', () => {
    const error = new TestError();
    expect(error.telemetry).toBe(false);
  });

  it('should have default documentation value of false', () => {
    const error = new TestError();
    expect(error.documentation).toBe(false);
  });
});
