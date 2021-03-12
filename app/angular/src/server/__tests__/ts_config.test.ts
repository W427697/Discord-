import path from 'path';
import getTsLoaderOptions from '../ts_config';

jest.mock('path', () => ({
  resolve: jest.fn(() => 'tsconfig.json'),
}));
jest.mock('@storybook/node-logger');

describe('ts_config', () => {
  it('should return the config with the path to the tsconfig.json', () => {
    const config = getTsLoaderOptions('.foo');

    expect(config).toEqual({
      transpileOnly: true,
      compilerOptions: {
        emitDecoratorMetadata: true,
      },
      configFile: 'tsconfig.json',
    });
  });

  it('should return object with transpileOnly: true when there is no tsconfig.json', () => {
    // @ts-ignore
    path.resolve.mockReturnValue(false);
    const config = getTsLoaderOptions('.foo');

    expect(config).toEqual({
      transpileOnly: true,
      compilerOptions: {
        emitDecoratorMetadata: true,
      },
    });
  });
});
