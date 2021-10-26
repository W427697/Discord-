/* eslint-disable jest/valid-title */
/* eslint-disable jest/no-export */
/* eslint-disable jest/expect-expect */
import global from 'global';
import { addSerializer } from 'jest-specific-snapshot';

const { describe, it } = global;

function snapshotTest({ item, asyncJest, framework, testMethod, testMethodParams }: any) {
  const { name, importPath, getStory, getRender } = item;

  if (asyncJest === true) {
    it(
      name,
      async () => {
        const story = await getStory();
        const render = await getRender();
        await new Promise<void>((resolve, reject) =>
          testMethod({
            done: (error: any) => (error ? reject(error) : resolve()),
            story: { ...story, render },
            context: { ...story, fileName: importPath, framework },
            ...testMethodParams,
          })
        );
      },

      testMethod.timeout
    );
  } else {
    it(
      name,
      async () => {
        const story = await getStory();
        const render = await getRender();
        testMethod({
          story: { ...story, render },
          context: { ...story, fileName: importPath, framework },
          ...testMethodParams,
        });
      },
      testMethod.timeout
    );
  }
}

function snapshotTestSuite({ item, suite, ...restParams }: any) {
  const { title, children } = item;
  describe(suite, () => {
    describe(title, () => {
      children.forEach((c: any) => {
        snapshotTest({ item: c, ...restParams });
      });
    });
  });
}

function snapshotsTests({ data, snapshotSerializers, ...restParams }: any) {
  if (snapshotSerializers) {
    snapshotSerializers.forEach((serializer: any) => {
      addSerializer(serializer);
      expect.addSnapshotSerializer(serializer);
    });
  }

  data.forEach((item: any) => {
    snapshotTestSuite({ item, ...restParams });
  });
}

export default snapshotsTests;
