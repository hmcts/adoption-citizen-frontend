export class User {
  constructor (public id: string,
               public email: string,
               public forename: string,
               public surname: string,
               public roles: string[],
               public group: string,
               public bearerToken: string) {}

  isInRoles (...requiredRoles: string[]): boolean {
    return requiredRoles.every(requiredRole => this.roles.includes(requiredRole))
  }
}
