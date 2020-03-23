import { RoutablePath } from 'common/router/routablePath';

export class Paths {
  static readonly homePage = new RoutablePath('/');
  static readonly landing = new RoutablePath('/landing');
  static readonly logout = new RoutablePath('/logout');
}
