import { IDBImpl } from './interface';

// LocalStorage driver
export class IDBStorageImpl implements IDBImpl {
  private meta: { [key: string]: any } = {};

  constructor() {
    this.meta = this.get('__meta');
    if (this.meta === null) {
      this.meta = {};
      this.set('__meta', {});
    }
  }

  public get(key: string): any|null {
    try {
      let v = localStorage.getItem(key);
      if (v === null) { // tslint:disable-line no-null-keyword
        throw new Error();
      }
      return JSON.parse(v);
    } catch (e) {
      return null;
    }
  }

  public set(key: string, value: any): boolean {
    try {
      let v = JSON.stringify(value);
      this.meta[key] = true;
      localStorage.setItem(key, v);
      if (key !== '__meta') {
        this.updateMeta();
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  public delete(keys: string[]): void {
    for (let key of keys) {
      delete this.meta[key];
      localStorage.removeItem(key);
    }
    this.updateMeta();
  }

  public clear(): void {
    for (let k in this.meta) {
      if (this.meta.hasOwnProperty(k)) {
        localStorage.removeItem(k);
      }
    }
    this.meta = {};
    this.updateMeta();
  }

  private updateMeta() {
    return this.set('__meta', this.meta);
  }
}
