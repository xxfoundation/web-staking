import { ApolloClient, ApolloLink, HttpLink, from, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { RetryLink } from '@apollo/client/link/retry';
import { getMainDefinition } from '@apollo/client/utilities';
import { OperationDefinitionNode } from 'graphql';
import { createClient } from 'graphql-ws';
import { InMemoryCache } from '@apollo/client';

import { apolloLink as sentryLink } from './sentry';

const apolloCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        blocks_by_pk: {
          keyArgs: ['block_number'],
          merge: (existing = {}, incoming = {}) => {
            return { ...existing, ...incoming };
          }
        }
      }
    }
  }
});

const graphqlHost = process.env.REACT_APP_BACKEND_HOST || 'localhost:8080';
const httpLink = new HttpLink({ uri: `https://${graphqlHost}/v1/graphql` });
const wsLink = new GraphQLWsLink(
  createClient({
    retryAttempts: 3,
    url: `wss://${graphqlHost}/v1/graphql`,
    disablePong: true
  })
);
const retryLink = new RetryLink();

const links = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  ApolloLink.from([retryLink, httpLink]),
);

export const client = new ApolloClient({
  link: from([
    sentryLink,
    links,
  ]),
  cache: apolloCache
})