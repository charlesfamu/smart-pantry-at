import { Pinecone } from '@pinecone-database/pinecone';

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

export let pinecone: Pinecone | null = null;
export const initializePinecone = () => {
  if (pinecone === null) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY ?? '',
      fetchApi: fetch,
    });
  }   
}

// Using a plain object to map the Pinecone index names
export const IndexNameMappings = {
  XJ900: process.env.PINECONE_XJ900 ?? '',
  Prowings: process.env.PINECONE_PROWINGS ?? '',
};

export const PineconeNamespaces = {
  NamespaceOne: process.env.PINECONE_NAMESPACE_ONE ?? '',
  NamespaceTwo: process.env.PINECONE_NAMESPACE_TWO ?? '',
  NamespaceThree: process.env.PINECONE_NAMESPACE_THREE ?? '',
}

export enum ValidRequestIndicies {
  XJ900 = 'XJ900',
  Prowings = 'Prowings',
}
