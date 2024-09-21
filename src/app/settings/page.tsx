'use client'
import { usePinecone } from '@/context/PineconeContext';

const SettingsPage = () => {
  const { pineconeIndex, setPineconeIndex } = usePinecone();

  return (
    <div className="flex flex-col w-1/2 mx-auto text-center">
      <h1 className="text-xl mb-4">Current Inventory - {pineconeIndex}</h1>
      <div className="flex flex-row gap-2 justify-center">
        <button
          className="px-4 py-2 text-sm bg-accent text-gray-300 hover:bg-accent-dark transition-transform duration-200 ease-in-out transform hover:scale-105 rounded-none"
          onClick={() => setPineconeIndex('XJ900')}>
          XJ900
        </button>
        <button
          className="px-4 py-2 text-sm bg-accent text-gray-300 hover:bg-accent-dark transition-transform duration-200 ease-in-out transform hover:scale-105 rounded-none"
          onClick={() => setPineconeIndex('Prowings')}>
          Prowings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;