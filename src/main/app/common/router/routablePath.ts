const pathParameterRegex = /\/:[^\/]+/g

export class RoutablePath {
  private _uri: string

  constructor (uri: string, public feature: boolean = true) {
    if (!uri || !uri.trim()) {
      throw new Error('uri is missing')
    }
    this._uri = uri
  }

  get uri (): string {
    return this._uri.replace(/\/index$/, '') // remove /index from uri's
  }

  get associatedView (): string {
    if (!this.feature) {
      return this._uri
        .replace(pathParameterRegex, '')
        .substring(1)
    }

    const split_uri: string[] = this._uri
      .replace(pathParameterRegex, '')
      .substring(1)
      .split('/')

    const isCaseUri: boolean = split_uri[0] === 'case'
    const viewPath: string = split_uri.slice(isCaseUri ? 2 : 1).join('/')

    return `views/${viewPath}`
  }
}
