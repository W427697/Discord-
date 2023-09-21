/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
import type { DeveloperTools } from 'store2';
import { parse, stringify } from 'telejson';

// setting up the store, overriding set and get to use telejson
export default (_: DeveloperTools) => {
  _.fn(
    'set',
    function (this: { _area: Storage; _in: (key: string) => string }, key: string, data: object) {
      return _.set(this._area, this._in(key), stringify(data, { maxDepth: 50 }));
    }
  );
  _.fn(
    'get',
    function (this: { _area: Storage; _in: (key: string) => string }, key: string, alt: string) {
      const value = _.get(this._area, this._in(key));
      return value !== null ? parse(value) : alt || value;
    }
  );
};
