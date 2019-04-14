import { IDBImpl } from './interface';

// Cookie driver
export class IDBCookieImpl implements IDBImpl {
  private cookieDomain: string;
  private meta: { [key: string]: any } = {};

  constructor(cookieDomain: string) {
    this.cookieDomain = cookieDomain;
    this.meta = this.get('__meta');
    if (this.meta === null) {
      this.meta = {};
      this.set('__meta', {});
    }
  }

  public get(key: string): any|null {
    let result = new RegExp(
      '(?:^|; )' +
      encodeURIComponent(key) +
      '=([^;]*)'
    ).exec(document.cookie);

    try {
      return result ? JSON.parse(result[1]) : null;
    } catch (e) {
      return result[1];
    }
  }

  public set(key: string, value: any): boolean {
    let date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    let expires = ';expires=' + date.toUTCString();
    let domain = this.cookieDomain ? ';domain=.' + this.cookieDomain : '';
    document.cookie = key + '=' + JSON.stringify(value) + expires + domain + '; path=/';
    if (key !== '__meta') {
      this.meta[key] = true;
      this.updateMeta();
    }
    return true;
  }

  public delete(keys: string[]): void {
    let date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000)); // time in past
    let expires = ';expires=' + date.toUTCString();
    let domain = this.cookieDomain ? ';domain=.' + this.cookieDomain : '';

    keys.forEach((key: string) => {
      document.cookie = key + '=' + expires + domain + '; path=/';
      delete this.meta[key];
    });
    this.updateMeta();
  }

  public clear(): void {
    this.delete(Object.keys(this.meta));
  }

  private updateMeta() {
    return this.set('__meta', this.meta);
  }
}
