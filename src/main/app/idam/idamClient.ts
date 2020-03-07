import config from 'config';
import request from 'request-promise';

import { User } from './user';
import { AuthToken } from './AuthToken';

const idamApiUrl = config.get<string>('idam.api.url');

export class IdamClient {

  static async getUserFromJwt (jwt: string): Promise<User> {
    const requestOptions = Object.assign({
      url: `${idamApiUrl}/details`,
      headers: { Authorization: `Bearer ${jwt}` },
    });

    const data = JSON.parse(await request
      .get(requestOptions));

    return new User(
      data.id,
      data.email,
      data.forename,
      data.surname,
      data.roles,
      data.group,
      jwt,
    );
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

  static async getAuthToken (code: string, redirectUri: string): Promise<AuthToken> {
    const clientId = config.get<string>('oauth.clientId');
    const clientSecret = config.get<string>('secrets.adoption.citizen-oauth-client-secret');
    const url = `${config.get('idam.api.url')}/oauth2/token`;

    const formData = Object.assign({}, {
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': redirectUri,
    });

    const requestOptions = Object.assign({
      url: url,
      form: formData,
      auth: {
        user: clientId,
        pass: clientSecret,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = JSON.parse(await request.post(requestOptions));
    return new AuthToken(
      data.access_token,
      data.token_type,
      data.expires_in,
    );
  }

  static async invalidateSession (jwt: string): Promise<void> {
    const options = {
      uri: `${config.get('idam.api.url')}/session/${jwt}`,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    await request.delete(options);
  }
}
