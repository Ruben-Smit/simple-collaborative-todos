import { getDb as getDriverDb } from '$db_driver';

export const getDb = (platform?: App.Platform) => {
  return getDriverDb(platform);
};

export const db = new Proxy({} as any, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance as object, prop, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
