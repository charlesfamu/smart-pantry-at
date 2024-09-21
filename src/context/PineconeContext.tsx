'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

type PineconeContextType = {
  pineconeIndex: string;
  setPineconeIndex: (index: string) => void;
}

// Define the context
const PineconeContext = createContext<PineconeContextType | undefined>(undefined);

export const PineconeProvider = ({ children }: { children: ReactNode }) => {
  const [pineconeIndex, setPineconeIndex] = useState<string>('ProWings');

  const value = {
    pineconeIndex,
    setPineconeIndex,
  };

  return (
    <PineconeContext.Provider value={value}>
      {children}
    </PineconeContext.Provider>
  );
};

// Custom hook for easy access
export const usePinecone = () => {
  const context = useContext(PineconeContext);
  if (!context) {
    throw new Error('usePinecone must be used within a PineconeProvider');
  }
  return context;
};
