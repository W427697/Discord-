/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
import { parse, stringify } from 'telejson';

interface Meta {
  _area?: string;
  _in: (key: string) => string;
}

// setting up the store, overriding set and get to use telejson
export default (_: any) => {
  _.fn('set', function (this: Meta, key: string, data: object) {
    return _.set(this._area, this._in(key), stringify(data, { maxDepth: 50 }));
  });
  _.fn('get', function (this: Meta, key: string, alt: string) {
    const value = _.get(this._area, this._in(key));
    return value !== null ? parse(value) : alt || value;
  });
};
