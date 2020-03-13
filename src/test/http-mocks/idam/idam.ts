import config from 'config';
import * as HttpStatus from 'http-status-codes';

import mock from 'nock';

const apiServiceBaseURL: string = config.get<string>('idam.api.url');

export const defaultAccessToken = '123DummyAccessToken456';

export function resolveRetrieveUserFor (id: string, ...roles: string[]): mock.Scope {
  return mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.OK, { id: id, roles: roles, email: 'user@example.com' });
}

export function resolveAuthToken (token: string): void {
  mock(apiServiceBaseURL)
    .post(new RegExp('/oauth2/token.*'))
    .reply(HttpStatus.OK, {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 28800,
    });
}

export function rejectAuthToken (): void {
  mock(apiServiceBaseURL)
    .post(new RegExp('/oauth2/token.*'))
    .reply(HttpStatus.UNAUTHORIZED);
}

export function resolveInvalidateSession (token: string): void {
  mock(apiServiceBaseURL)
    .delete(`/session/${token}`)
    .reply(HttpStatus.OK);
}

export function rejectInvalidateSession (token: string = defaultAccessToken, reason = 'HTTP error'): void {
  mock(apiServiceBaseURL)
    .delete(`/session/${token}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}

export function rejectRetrieveUserFor (reason: string): mock.Scope {
  return mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.FORBIDDEN, reason);
}
