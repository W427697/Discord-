import mockedGlobal from 'global';
import { getQueryParams, getQueryParam } from './queryparams';

// Mock the global module to control the value of the global object
jest.mock('global', () => {
  // Set up an empty object for the global mock
  const globalMock = {};

  // Return the global mock object as the default export
  return globalMock;
});

describe('query-params', () => {
  describe('getQueryParams', () => {
    it('should parse query parameters from the document location search string', () => {
      // Set up the global mock object with a mocked document.location.search property
      mockedGlobal.document = {
        location: {
          search: '?foo=bar&baz=qux',
        },
      };

      // Ensure that the getQueryParams function parses the query parameters correctly
      expect(getQueryParams()).toEqual({
        foo: 'bar',
        baz: 'qux',
      });
    });

    it('should return an empty object if the document location search string is not defined', () => {
      // Set up the global mock object with a mocked document.location object that does not have a search property
      mockedGlobal.document = {
        location: {},
      };

      // Ensure that the getQueryParams function returns an empty object if the search string is not defined
      expect(getQueryParams()).toEqual({});
    });
  });

  describe('getQueryParam', () => {
    it('should return the value of a specific query parameter with the specified key', () => {
      // Set up the global mock object with a mocked document.location.search property
      mockedGlobal.document = {
        location: {
          search: '?foo=bar&baz=qux',
        },
      };

      // Ensure that the getQueryParam function returns the correct value for a given query parameter key
      expect(getQueryParam('foo')).toEqual('bar');
      expect(getQueryParam('baz')).toEqual('qux');
    });

    it('should return undefined if the specified query parameter does not exist', () => {
      // Set up the global mock object with a mocked document.location.search property
      mockedGlobal.document = {
        location: {
          search: '?foo=bar&baz=qux',
        },
      };

      // Ensure that the getQueryParam function returns undefined if the specified query parameter does not exist
      expect(getQueryParam('invalid')).toBeUndefined();
    });
  });
});
