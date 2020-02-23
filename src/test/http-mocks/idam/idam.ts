import config from 'config'
import * as HttpStatus from 'http-status-codes'

import mock from 'nock'

const apiServiceBaseURL: string = config.get<string>('idam.api.url')
const s2sAuthServiceBaseURL = config.get<string>('idam.service-2-service-auth.url')

export const defaultAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpZGFtIiwiaWF0IjoxNDgzMjI4ODAwLCJleHAiOjQxMDI0NDQ4MDAsImF1ZCI6ImFkb3B0aW9uIiwic3ViIjoiYWRvcHRpb24ifQ.0EKZpjflxgaOryKryWVgXpsfJT1zTZAHM0Qfyn2-X1Q'
  // valid until 1st Jan 2100
  /*
  {
    "iss": "idam",
    "iat": 1483228800,
    "exp": 4102444800,
    "aud": "adoption",
    "sub": "adoption"
  }
   */

export function resolveRetrieveUserFor (id: string, ...roles: string[]) {
  return mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.OK, { id: id, roles: roles, email: 'user@example.com' })
}

export function resolveAuthToken (token: string) {
  mock(apiServiceBaseURL)
    .post(new RegExp('/oauth2/token.*'))
    .reply(HttpStatus.OK, {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 28800
    })
}

export function rejectAuthToken (token: string) {
  mock(apiServiceBaseURL)
    .post(new RegExp('/oauth2/token.*'))
    .reply(HttpStatus.UNAUTHORIZED)
}

export function resolveInvalidateSession (token: string) {
  mock(apiServiceBaseURL)
    .delete(`/session/${token}`)
    .reply(HttpStatus.OK)
}

export function rejectInvalidateSession (token: string = defaultAuthToken, reason: string = 'HTTP error') {
  mock(apiServiceBaseURL)
    .delete(`/session/${token}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function rejectRetrieveUserFor (reason: string) {
  return mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.FORBIDDEN, reason)
}

export function resolveRetrieveServiceToken (token: string = defaultAuthToken) {
  return mock(s2sAuthServiceBaseURL)
    .post('/lease')
    .reply(HttpStatus.OK, token)
}

export function rejectRetrieveServiceToken (reason: string = 'HTTP error') {
  return mock(s2sAuthServiceBaseURL)
    .post('/lease')
    .reply(HttpStatus.BAD_REQUEST)
}
