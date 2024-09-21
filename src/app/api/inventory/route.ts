import { NextRequest, NextResponse } from 'next/server';
import {
  IndexNameMappings,
  initializePinecone,
  pinecone,
  PineconeNamespaces,
  ValidRequestIndicies
} from '../pinecone.utils';

export async function GET(request: NextRequest) {
  initializePinecone();
  const { searchParams } = new URL(request.url);
  const parameterIndexName = searchParams.get('indexName');
  let inventory: string[] = [];
  try {
    const validIndexName = parameterIndexName && Object.values(ValidRequestIndicies).includes(parameterIndexName as ValidRequestIndicies);
    const pineconeIndex = validIndexName 
      ? IndexNameMappings[parameterIndexName as keyof typeof IndexNameMappings] 
      : IndexNameMappings.Prowings;
    
    const index = pinecone?.index(pineconeIndex);
    const namespaces = Object.values(PineconeNamespaces);

    for (const namespace of namespaces) {
      const response = await index?.namespace(namespace).listPaginated();
      if (response?.vectors) {
        inventory = [...inventory, ...response.vectors.map((item) => item.id ?? '')];
      }
    }
    return NextResponse.json(inventory, { status: 200 });
  } catch (error) {
    // console.error('Error parsing response:', error);
    return NextResponse.json({ error: 'Error parsing response' }, { status: 500 });
  }
}