import config from 'config';
import * as HttpStatus from 'http-status-codes';

import mock from 'nock';

const apiServiceBaseURL: string = config.get<string>('idam.api.url');
const s2sAuthServiceBaseURL = config.get<string>('idam.service-2-service-auth.url');

export const defaultAuthToken = '*AAJTSQACMDEAAlMxAAA.*eyJ0eXAiOiJKV1QiLCJjdHkiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ZXlKMGVYQWlPaUpLVjFRaUxDSjZhWEFpT2lKT1QwNUZJaXdpWlc1aklqb2lRVEV5T0VOQ1F5MUlVekkxTmlJc0ltRnNaeUk2SW1ScGNpSjkuLnp0UlNhQW5OMjRLRGtsUGRRMnpPbHcuTmE3UGhmN0NLdDZ1aFdVVDJQS2tnTTZjYVRaWWV3NlB3TGEtVVdwZW5PSlMydUszaS1PbGZXTzZBQ29vTkE3dElVLWR4SWlxUHZJX1dFRnY2S2dEV1VlRlNNRlNSQlVTWlJUUkluWWxvV1MweDN6cjdVbV9HZWRmd3VhZ0ZhcUM2bjk0MUhlaXZOYXhzTXZROGJqVWpWaUlhdllDTlNHWThUaVB6VEdWSDYzVUxUeHRUZDMtODEtNm1SLURZU0c4VGszMG1wYWxYQjExNFhlWE0wYUMyQXFJbEUwMGJyMFBVcEk0QWsxSW9EaDlxV0I4M3h5WW9aTjdraUpRZlZhWW8xaWVmckc4OWUxWWZSSG00cjBkdVRCVlo4ZzVIWFlmNVozTkZwNDdpbUR1YzU3WG9mRkhZQ05OWGt0M1FxcHVmalhsaEI4U0Z2UlY5WUQwQ3dQdUZIeFBYUS1DWGo4Y0NzMnMzajY5TE5BME5CMUtGa1haQVM4RUZ3SUo2NzB5RmlIZ2o1dXB2Z2libnBraGlXcmlTTG1iWTBpdmFvSDVmQmNsa1JVTUxQTDhWZEpFc2NVWi1EaXpaY1FRdUNkcHZfY3RBY19qZEJLLXBrNHAzaE9hcjFIMWJKUHFaeXlrU2V0Sy01Tm43LUFYS09PcV9KUFBncTMxSUdaRVZmVUIxWEpsVUJKcjVvcTNKSk5RVkVfWU1uU1Q1LXJmWXdHVlJaMEh2Vm1rajBtek9qc3pWTDh1WXNVTjBUWlhWQVBMNnRocXRkeHUxVlI5X1E5MnFwejRtcnZHM2tyUGZyR1M3Vno4Rll0NkUydVV2aTdNM0gtVklXSWFNcFUyWjZOQl9od0VqU05ZYlFDb2k1d0Q0QmNwX2s3RmxpaTFBaHFBNWo2SU9FdGxsTmdya3dITzBaczUyQ1U3cHhZR1NmbU5nX1QwWDE3Q3RqYVFGcDhUTDFYLUZTMHhmdnlWVHhUbWc1RlFGQzNmdHlWQ1VnWFF3b3JFM0Y0WDZ1ZzFqY2NnWlQwVDQ0ZG9QNnJvdThCeVhSU0F5TUVHVGp1SjBld0ltR0cwNjNkcmdxWFExazVUc0ppV1NJZ0cwbi1lbWZmTy1pVmxQZ2RqZDRUUzJPazlwSWZkMXBqVHd2aFlyVGt1ZmNJV3JqQmhnNGR5YkFkNktlMWVmOHNQWDZzWEFLVkxjRUJrZWV0aUN2OUVaMWc4QWNDdGtLZDBnLTdpSzBpbDlVa092VzdUeDJjSmFRQ0p1ek5WejdPMTV4bjhwVHJMMXJkbnpoUnZhMFRBZDZrRndpWDVBSm14eHBsQktYX0xmblBqZDdwS2x3UUI3TFRGZ2xsSFNkVVNYWDctZ0k3b21jZnRZWWFvYW44cXl6bUpEamVpT01sLTl1NjV0TlRHV1RpUFpMVmVfQ2QtYkVvbU1FYmF2dkVobjZJVlpTYmVZZVNUQzFONXc1S2tURUFrX2xueW5YTHZ1eEpCUTdrQUwtWmtySGNSWDRHZWhDSElraDNleDFvQlhFdnJYVXRGZk01aks5Q183TElkQUJVYWdVQXQ0R200N0ZWOXV6cUVBT081Z2NIb0g5UEpSSldiMDhTMGEyYkd1STZlbXlsRGw2clowejJWbFNhdUlQc0N6bUNWLU1TOWRNZ1ozU1RzdVZEeWx5VVdIMWhWTm5lYTNDUFJNR2FUMUplYWV5SV92RnFXaEx6dk1fRF9pNV8wOG5FbmRCeEVhMVVLYVVfSmwyZ1NGOWRLcGl0dWxKbmh2UGZacWx0cHpDaHBKNmEwZF9ya1BTeGRoSmw3X0dJQXJuN0JxX3dldXZabjRsX1hZVExZcTVmMl94OWdQZXFKSEFvenBGU0VIbXJJVVN5SVpwazVncTNDR2dNMjJSSGtoell3bGcuNTBaS3NrV08xVFF1U1VLb3VsRHZnUQ.Fbcfvx5TjLVsG5nnIliLaIOmSonK4q1ErzZcNvHKwaY';

export const defaultAccessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpZGFtIiwiaWF0IjoxNDgzMjI4ODAwLCJleHAiOjQxMDI0NDQ4MDAsImF1ZCI6ImFkb3B0aW9uIiwic3ViIjoiYWRvcHRpb24ifQ.0EKZpjflxgaOryKryWVgXpsfJT1zTZAHM0Qfyn2-X1Q';
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

export function rejectRetrieveUserWith500For (): mock.Scope {
  return mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.INTERNAL_SERVER_ERROR);
}

export function resolveRetrieveServiceToken (token: string = defaultAccessToken): mock.Scope {
  return mock(s2sAuthServiceBaseURL)
    .post('/lease')
    .reply(HttpStatus.OK, token);
}

export function rejectRetrieveServiceToken (): mock.Scope {
  return mock(s2sAuthServiceBaseURL)
    .post('/lease')
    .reply(HttpStatus.BAD_REQUEST);
}
