import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import getTsLoaderOptions from '../ts_config';
import createForkTsCheckerInstance from '../create-fork-ts-checker-plugin';

describe('create-fork-ts-checker-plugin.test', () => {
  it('should create a ForkTsCheckerWebpackPlugin instance', () => {
    const tsLoaderOptions = getTsLoaderOptions('.foo');

    // todo resolve any
    const instance: any = createForkTsCheckerInstance(tsLoaderOptions);

    expect(instance).toBeInstanceOf(ForkTsCheckerWebpackPlugin);
    expect(instance.tsconfig).toEqual(tsLoaderOptions.configFile);
  });

  it('should create a ForkTsCheckerWebpackPlugin instance without passing options', () => {
    // add proper typing
    const instance = createForkTsCheckerInstance({} as any);
    expect(instance).toBeInstanceOf(ForkTsCheckerWebpackPlugin);
  });
});
