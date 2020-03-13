import { RoutablePath } from 'common/router/routablePath';

export class Paths {
  static readonly homePage = new RoutablePath('/', false)
  static readonly landing = new RoutablePath('/landing',false)
}
