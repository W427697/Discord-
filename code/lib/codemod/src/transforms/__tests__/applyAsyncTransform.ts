import type { Options, Parser, FileInfo, API } from 'jscodeshift';
import jsc from 'jscodeshift';

type TestOptions = {
  parser?: Parser | 'babylon' | 'flow' | 'ts' | 'tsx' | 'babel' | undefined;
};

type Transform = (
  file: FileInfo,
  api: API,
  options: Options
) => Promise<string> | null | undefined | void;

export async function applyAsyncTransform(
  module:
    | {
        default: Transform;
        parser: TestOptions['parser'] | undefined;
      }
    | Transform,
  options: Options | null | undefined,
  input: {
    path: string;
    source: string;
  },
  testOptions: TestOptions = {}
) {
  // Handle ES6 modules using default export for the transform
  const transform = 'default' in module ? module.default : module;

  let jscodeshift = jsc;

  // Jest resets the module registry after each test, so we need to always get
  // a fresh copy of jscodeshift on every test run.
  const parser = testOptions.parser || (module as any).parser;
  if (parser) {
    jscodeshift = jsc.withParser(parser);
  }

  const output = await transform(
    input,
    {
      jscodeshift,
      j: jscodeshift,
      stats: () => {},
    } as any,
    options || {}
  );

  return (output || '').trim();
}
