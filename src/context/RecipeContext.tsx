'use client'

import { usePinecone } from '@/context/PineconeContext';
import { _getDishRecipe, _getDishSuggestions, _getInventory, _getInventorySuggestions } from '@/services/shared.services';
import { DishType, SuggestedDishesType } from '@/types';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export interface RecipeContextType {
  // Define the properties and methods of the RecipeContext here
  dishRecipe: DishType | null;
  inventory: string[] | null;
  loading: boolean;
  suggestedDishes: SuggestedDishesType | null;
  getDishRecipe: (dish: string) => Promise<void>;
  getDishSuggestions: (dishRecipe: DishType, inventory: string[]) => Promise<void>;
  getInventorySuggestions: (inventory: string[]) => Promise<void>;
  getInventory: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
}

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [dishRecipe, setDishRecipe] = useState<DishType | null>(null);
  const [inventory, setInventory] = useState<string[] | null>(null);
  const [suggestedDishes, setSuggestedDishes] = useState<SuggestedDishesType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { pineconeIndex } = usePinecone();

  const getInventory = useCallback(async () => {
    // pinecone API
    const inventory = await _getInventory(pineconeIndex);
    if (Array.isArray(inventory) && inventory.length) {
      setInventory(inventory);
    }
  }, [pineconeIndex]);

  const getDishRecipe = useCallback(async (dish: string) => {
    if (!dish) return;
    setLoading(true);
    const response = await _getDishRecipe(dish);
    setDishRecipe(response);
    setLoading(false);
  }, []);

  const getDishSuggestions = useCallback(async (dishRecipe: DishType, inventory: string[]) => {
    if (!dishRecipe || !Array.isArray(inventory)) return;

    setLoading(true);
    const response = await _getDishSuggestions(dishRecipe, inventory, pineconeIndex);
    setSuggestedDishes(response);
    setLoading(false);
  },[pineconeIndex]);

  const getInventorySuggestions = useCallback(async (inventory: string[]) => {
    if (!Array.isArray(inventory) || !inventory.length) return;

    setLoading(true);
    const response = await _getInventorySuggestions(inventory);
    setSuggestedDishes(response);
    setLoading(false);
  }, []);

  const value = {
    dishRecipe,
    inventory,
    loading,
    suggestedDishes,
    getDishRecipe,
    getDishSuggestions,
    getInventorySuggestions,
    getInventory,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}
