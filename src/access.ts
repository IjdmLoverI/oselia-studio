import type { Access } from 'payload'

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const publishedOrAuthenticated: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }
