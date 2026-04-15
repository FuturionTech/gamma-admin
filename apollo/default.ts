export default {
  httpEndpoint: process.env.GQL_HOST || '',

  httpLinkOptions: {
    credentials: 'same-origin',
  },

  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },

  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },

  tokenName: 'auth.token',
  tokenStorage: 'cookie',
  authType: 'Bearer',
  authHeader: 'Authorization',

  websocketsOnly: false,
}
