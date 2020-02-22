import * as express from 'express'
import { StringUtils } from './StringUtils'

export function BuildURL (req: express.Request, path: string) {
  if (StringUtils.isBlank(path)) {
    throw new Error('Path null or undefined')
  }

  if (!req) {
    throw new Error('Request is undefined')
  }

  const protocol = 'https://'
  const host = req.headers.host
  const baseURL: string = `${protocol}${host}`

  if(path.startsWith('/')) {
    return baseURL + path
  } else {
    return `${baseURL}/${path}`
  }
}
