import config from 'config';
import request from 'request-promise';

import { User } from './user';
import { AuthToken } from './AuthToken';

const idamApiUrl = config.get<string>('idam.api.url');

export class IdamClient {

  static getUserFromJwt (jwt: string): Promise<User> {
    const requestOptions = Object.assign({
      url: `${idamApiUrl}/details`,
      headers: { Authorization: `Bearer ${jwt}` },
    });

    return request.get(requestOptions)
      .then((response) => {
        const user = JSON.parse(response);
        return new User(
          user.id,
          user.email,
          user.forename,
          user.surname,
          user.roles,
          user.group,
          jwt,
        );
      });
  }

  //We will need below in future but not for now
  /*
  static async getServiceToken (): Promise<ServiceAuthToken> {
    const oneTimePassword = otp({ secret: totpSecret }).totp()
    const options = {
      uri: `${s2sUrl}/lease`,
      body: new ServiceAuthRequest(microserviceName, oneTimePassword)
    }

    try {
      const data = await request.post(options)
      return new ServiceAuthToken(JSON.parse(data))
    } catch (err) {
      throw new Error(`Unable to get service token - ${err}`)
    }
  }
  */

  static getAuthToken (code: string, redirectUri: string): Promise<AuthToken> {
    const clientId = config.get<string>('oauth.clientId');
    const clientSecret = config.get<string>('secrets.adoption.citizen-oauth-client-secret');
    const url = `${config.get('idam.api.url')}/oauth2/token`;

    const formData = Object.assign({}, {
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': redirectUri,
      'client_id': clientId,
      'client_secret': clientSecret,
    });

    const requestOptions = Object.assign({
      url: url,
      form: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return request.post(requestOptions)
      .then((response) => {
        const authToken = JSON.parse(response);
        return new AuthToken(
          authToken.access_token,
          authToken.token_type,
          authToken.expires_in,
        );
      });
  }

  static invalidateSession (jwt: string): void {
    const options = {
      uri: `${config.get('idam.api.url')}/session/${jwt}`,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    request.delete(options);
  }
}
