// ~/composables/useApolloClient.ts
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import type { NormalizedCacheObject } from '@apollo/client/cache';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { useRuntimeConfig } from '#app';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export function useApolloFilesUploadClient(): ApolloClient<NormalizedCacheObject> {
    if (apolloClient) {
        return apolloClient;
    }

    const config = useRuntimeConfig();

    // Use the GraphQL endpoint from runtime config
    const graphqlEndpoint = config.public?.gqlHost || 'http://api.gamma.test/graphql';
    
    console.log('🔧 Apollo Client Configuration:', {
        endpoint: graphqlEndpoint,
        hasPublicConfig: !!config.public
    });

    const httpLink = createUploadLink({
        uri: graphqlEndpoint,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }) as unknown as ApolloLink;

    apolloClient = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
    });

    console.log('✅ Apollo Client initialized with endpoint:', graphqlEndpoint);

    return apolloClient;
}
