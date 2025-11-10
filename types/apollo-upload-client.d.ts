declare module 'apollo-upload-client/createUploadLink.mjs' {
  import { ApolloLink } from '@apollo/client';
  
  interface CreateUploadLinkOptions {
    uri: string;
    headers?: Record<string, string>;
    credentials?: string;
    [key: string]: any;
  }
  
  export default function createUploadLink(options: CreateUploadLinkOptions): ApolloLink;
} 