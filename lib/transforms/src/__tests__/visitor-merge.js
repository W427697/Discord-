import { visitorMerge } from '../utils/visitor-merge';

it('should not fail when called with zero visitors', () => {
  expect(visitorMerge()).toEqual({});
});

it('should not fail when called with empty visitors', () => {
  expect(visitorMerge({}, {})).toEqual({});
});

it('should merge visitors of the same type', () => {
  const visitorA = {
    ExportDefaultDeclaration() {
      //
    },
  };
  const visitorB = {
    ExportDefaultDeclaration() {
      //
    },
  };

  expect(visitorMerge(visitorA, visitorB)).toEqual({
    ExportDefaultDeclaration: expect.any(Function),
  });
});

it('should merge visitors of different type', () => {
  const visitorA = {
    ExportDefaultDeclaration() {
      //
    },
  };
  const visitorB = {
    ExportDefaultDeclaration: {
      enter() {
        //
      },
    },
  };

  expect(visitorMerge(visitorA, visitorB)).toEqual({
    ExportDefaultDeclaration: expect.objectContaining({ enter: expect.any(Function) }),
  });
});

it('should merge multiple object visitors', () => {
  const visitorA = {
    ExportDefaultDeclaration: {
      exit() {
        //
      },
    },
  };
  const visitorB = {
    ExportDefaultDeclaration: {
      enter() {
        //
      },
    },
  };

  expect(visitorMerge(visitorA, visitorB)).toEqual({
    ExportDefaultDeclaration: expect.objectContaining({
      enter: expect.any(Function),
      exit: expect.any(Function),
    }),
  });
});
