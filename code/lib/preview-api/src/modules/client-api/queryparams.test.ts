import mockedGlobal from 'global';
import { getQueryParams, getQueryParam } from './queryparams';

jest.mock('global', () => {
  return {};
});

describe('query-params', () => {
  describe('getQueryParams', () => {
    it('should parse query parameters from the document location search string', () => {
      mockedGlobal.document = {
        location: {
          search: '?foo=bar&baz=qux',
        },
      };

      expect(getQueryParams()).toEqual({
        foo: 'bar',
        baz: 'qux',
      });
    });

    it('should return an empty object if the document location search string is not defined', () => {
      mockedGlobal.document = {
        location: {},
      };

      expect(getQueryParams()).toEqual({});
    });
  });

  describe('getQueryParam', () => {
    it('should return the value of a specific query parameter with the specified key', () => {
      mockedGlobal.document = {
        location: {
          search: '?foo=bar&baz=qux',
        },
      };

      expect(getQueryParam('foo')).toEqual('bar');
      expect(getQueryParam('baz')).toEqual('qux');
    });

    it('should return undefined if the specified query parameter does not exist', () => {
      mockedGlobal.document = {
        location: {
          search: '?foo=bar&baz=qux',
        },
      };

      expect(getQueryParam('invalid')).toBeUndefined();
    });
  });
});
