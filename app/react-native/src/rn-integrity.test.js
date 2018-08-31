function mockErrorFn() {
  throw new Error('you can not require this module in React Native context');
}

describe('React Native integrity test', () => {
  jest.mock('react-native-iphone-x-helper', () => ({}));
  jest.mock('react-native', () => ({}));
  jest.mock('react-emotion', () => mockErrorFn());

  it('should not throw when anything when "preview" is required', () => {
    expect(() => {
      require.requireActual('./preview/index.js');
    }).not.toThrow();
  });
});
