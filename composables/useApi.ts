import type {
  ApolloClient,
  DocumentNode,
  FetchPolicy,
  NormalizedCacheObject,
} from '@apollo/client/core'

interface QueryOptions {
  variables?: Record<string, unknown>
  /** Defaults to `network-only` so lists always reflect fresh server state. */
  fetchPolicy?: FetchPolicy
  /** Sets X-Locale header for locale-aware queries. */
  locale?: string
}

interface MutateOptions {
  variables?: Record<string, unknown>
  /** Sets X-Locale header so Spatie HasTranslations writes to the correct locale. */
  locale?: string
}

/**
 * Central Apollo client accessor for Pinia stores and other non-setup contexts.
 *
 * Why: `@nuxtjs/apollo`'s `useAsyncQuery` only works reliably inside setup scopes.
 * Outside of setup (e.g. inside a Pinia action) we need direct access to the
 * Apollo client. Doing `const { $apollo } = useNuxtApp(); const client = $apollo.defaultClient`
 * in every store action is noisy and has historically been typo'd as `$apollo.default`
 * which silently breaks every mutation. This helper collapses that boilerplate and
 * throws consistently on GraphQL errors.
 *
 * Usage:
 *   const api = useApi()
 *   const data = await api.query<{ services: Service[] }>(GET_SERVICES, { variables })
 *   const out = await api.mutate<{ createService: Service }>(CREATE_SERVICE, { variables: { input } })
 */
export const useApi = () => {
  const { $apollo } = useNuxtApp()
  const client = $apollo.defaultClient as ApolloClient<NormalizedCacheObject>

  const buildContext = (locale?: string) => {
    if (!locale) return undefined
    return { headers: { 'X-Locale': locale } }
  }

  const query = async <T>(document: DocumentNode, options: QueryOptions = {}): Promise<T> => {
    const response = await client.query<T>({
      query: document,
      variables: options.variables,
      fetchPolicy: options.fetchPolicy ?? 'network-only',
      context: buildContext(options.locale),
    })

    if (response?.errors?.length) {
      throw new Error(response.errors[0].message)
    }

    if (!response.data) {
      throw new Error('No data returned from server')
    }

    return response.data
  }

  const mutate = async <T>(document: DocumentNode, options: MutateOptions = {}): Promise<T> => {
    const response = await client.mutate<T>({
      mutation: document,
      variables: options.variables,
      context: buildContext(options.locale),
    })

    if (response?.errors?.length) {
      throw new Error(response.errors[0].message)
    }

    if (!response.data) {
      throw new Error('No data returned from server')
    }

    return response.data
  }

  return { client, query, mutate }
}
