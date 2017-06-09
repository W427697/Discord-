import Database, { Collection } from '../';

describe('Database', () => {
  let persister = null;
  let database = null;

  beforeEach(() => {
    persister = { set: jest.fn(), get: jest.fn() };
    database = new Database({ persister });
  });

  describe('getCollection', () => {
    it('should return a Collection instance', () => {
      const coll = database.getCollection('test-collection');
      expect(coll.name).toEqual('test-collection');
      expect(coll.persister).toEqual(persister);
    });
  });
});

describe('Collection', () => {
  let persister = null;
  let collection = null;

  beforeEach(() => {
    persister = { set: jest.fn(), get: jest.fn() };
    collection = new Database({ persister }).getCollection('test-collection');
  });

  describe('set', () => {
    it('should call persister method', () => {
      const item = { id: 1 };
      collection.set(item);
      expect(persister.set.calledOnce).toEqual(true);
      expect(persister.set).toHaveBeenCalledWith(collection.name, item);
    });
    it('should set an id if its missing', () => {
      const result = collection.set({ foo: 'bar' });
      expect(persister.set.calledOnce).toEqual(true);
      expect(persister.set.args[0][0]).toEqual(collection.name);
      expect(persister.set.args[0][1].id).toBe(Jasmine.any(String));
      expect(persister.set.args[0][1].foo).toEqual('bar');
      expect(result).toBe(Jasmine.any(Promise));
    });
  });

  describe('get', () => {
    it('should call persister method', () => {
      const result = collection.get('test-query', 'test-options');
      expect(persister.get.calledOnce).toEqual(true);
      expect(persister.get.args[0][0]).toEqual(collection.name);
      expect(persister.get.args[0][1]).toEqual('test-query');
      expect(persister.get.args[0][2]).toEqual('test-options');
      expect(result).toBe(Jasmine.any(Promise));
    });
  });
});
