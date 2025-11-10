module.exports = {
    // The GraphQL endpoint.
    httpEndpoint: process.env.GQL_HOST || "",

    // Provide a GraphQL endpoint to be used client-side. Overrides `httpEndpoint`.
    // browserHttpEndpoint: '/graphql',

    // See https://www.apollographql.com/docs/link/links/http.html#options
    httpLinkOptions: {
        credentials: 'same-origin',
    },

    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },

    // DevTools configuration (replaces deprecated connectToDevTools)
    devtools: {
        enabled: process.env.NODE_ENV === 'development',
    },

    // Specify a websocket endpoint to be used for subscriptions.
    // The `wss` protocol is recommended in production.
    // wsEndpoint: 'ws://localhost:4000',

    // LocalStorage token
    tokenName: 'auth.token',
    authenticationType: 'Bearer',

    // Specify if the client should solely use WebSocket.
    // requires `wsEndpoint`.
    websocketsOnly: false,
};
