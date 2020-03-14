const pathParameterRegex = /\/:[^/]+/g;

export class RoutablePath {
  private _uri: string

  constructor (uri: string) {
    if (!uri || !uri.trim()) {
      throw new Error('uri is missing');
    }
    this._uri = uri;
  }

  get uri (): string {
    return this._uri.replace(/\/index$/, ''); // remove /index from uri's
  }

  get associatedView (): string {

    const splitUri: string[] = this._uri
      .replace(pathParameterRegex, '')
      .substring(1)
      .split('/');

    const viewPath: string = splitUri.pop();

    return `views/${viewPath}`;
  }
}
