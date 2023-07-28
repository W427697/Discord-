import { defineError, StorybookError } from './define-error';

describe('create', () => {
  beforeEach(() => {
    // Mocking the global telemetry function
    globalThis.telemetry = jest.fn();
  });

  it('Creates the correct object', () => {
    const result = defineError({
      category: 'CLI',
      code: 1,
      template: (data: any) => `Something went wrong: ${data}`,
    });

    expect(result).toMatchObject({
      category: 'CLI',
      code: '0001',
      error: expect.any(Function),
    });
  });

  it('The generated error is throwable', () => {
    const result = defineError({
      category: 'CLI',
      code: 1,
      template: (data: any) => `Something went wrong: ${data}`,
    });

    expect(() => {
      throw result.error('');
    }).toThrowError(result.error(''));
  });

  it('returns the correct message with documentation', () => {
    const result = defineError({
      category: 'CLI',
      code: 1,
      template: (data: any) => `Something went wrong: ${data}`,
      documentation: 'https://example.com',
    });

    const data = 'foo';
    const { message } = result.error(data);

    expect(message).toContain('[SB_CLI_0001] Something went wrong: foo');
    expect(message).toContain('More info: https://example.com');
  });

  it('returns the correct message without documentation', () => {
    const result = defineError({
      category: 'CLI',
      code: 1,
      template: (data: any) => `Something went wrong: ${data}`,
    });

    const data = 'foo';
    const { message } = result.error(data);

    expect(message).toContain('[SB_CLI_0001] Something went wrong: foo');
    expect(message).not.toContain('More info');
  });

  it('calls telemetry with correct arguments', () => {
    const result = defineError({
      category: 'CLI',
      code: 1,
      template: (data: any) => `Something went wrong: ${data}`,
      telemetry: true,
    });

    const data = 'foo';
    const error = result.error(data);

    expect(globalThis.telemetry).toHaveBeenCalledWith({
      isError: true,
      payload: result.error(data),
    });

    expect(error).toBeInstanceOf(StorybookError);
    expect(error.category).toBe('CLI');
    expect(error.code).toBe('0001');
  });

  it('calls telemetry when it is enabled and globalThis.telemetry is available', () => {
    globalThis.telemetry = jest.fn();

    const result = defineError({
      category: 'CLI',
      code: 1,
      template: (data: any) => `Something went wrong: ${data}`,
      telemetry: true,
    });

    const data = 'foo';
    result.error(data);

    expect(globalThis.telemetry).toHaveBeenCalled();
  });

  it('does not call telemetry when it is not enabled', () => {
    globalThis.telemetry = jest.fn();

    const result = defineError({
      category: 'CLI',
      code: 1,
      template: (data: any) => `Something went wrong: ${data}`,
    });

    const data = 'foo';
    result.error(data);

    expect(globalThis.telemetry).not.toHaveBeenCalled();
  });
});
