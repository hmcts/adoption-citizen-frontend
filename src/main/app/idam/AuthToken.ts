export class AuthToken {
  constructor (
    public readonly accessToken: string,
    public readonly tokenType: string,
    public readonly expiresIn: number,
  ) {}
}
