import * as HttpStatus from 'http-status-codes'

export function hasTokenExpired (err) {
  return (err.statusCode === HttpStatus.FORBIDDEN || err.statusCode === HttpStatus.UNAUTHORIZED)
}
