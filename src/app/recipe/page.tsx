// app/recipe/page.tsx
'use client';

import { usePinecone } from '@/context/PineconeContext';
import { useRecipeContext } from '@/context/RecipeContext';
import { DishType, SuggestedDishesType } from '@/types';
import { useEffect, useState } from 'react';

const SuggestionCard = (dish: DishType) => {
  return (
    <div className="bg-dark-gray p-6 shadow-md text-left max-w-[300px]">
      <h3 className="text-2xl font-bold mb-2 text-white">{dish.dish}</h3>
      <p className="text-sm text-gray-400 mb-4">
        Cuisine: {dish.cuisine} | Prep Time: {dish.preparationTime}
      </p>

      {/* Ingredients Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dish.ingredients.map((ingredient, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-700 text-sm text-gray-300">
            {ingredient.name}
          </span>
        ))}
      </div>
    </div>
  );
};

const MissingIngredients = (suggestedDishes: SuggestedDishesType) => {
  if (suggestedDishes.originalDish.name === null) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-300">Check out these suggestions using the ingredients you already have!</p>
      </div>
    );
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold">
        Unfortunately, you are missing <span className="text-emerald-600">{`${suggestedDishes.missingIngredients?.length ?? 'a few'} `}</span>
        ingredient{`${suggestedDishes.missingIngredients?.length === 1 ? '' : 's'}`} to make <span className="text-orange-600">{suggestedDishes.originalDish?.name ?? 'your dish'}</span>. 
      </h2>
      <h3 className="text-base font-bold">It looks like you need the following ingredients:</h3>
      <span className="text-sm text-gray-600 text-wrap">{suggestedDishes.missingIngredients?.join(', ').toUpperCase() ?? 'Check your kitchen.'}</span>
      <p className="text-sm text-gray-300 mt-4">Instead, check out these suggestions using the ingredients you already have!
      </p>
    </div>
  );
};

export default function RecipePage() {
  const [dish, setDish] = useState('');
  const [surpriseMe, setSurpriseMe] = useState(false);
  const { pineconeIndex } = usePinecone();
  const { 
    dishRecipe,  
    getDishRecipe,
    getInventorySuggestions,
    getDishSuggestions,
    getInventory,
    loading,
    inventory,
    suggestedDishes,
  } =  useRecipeContext();

  useEffect(() => {
    const handleGetInventory = async () => {
      await getInventory();
    }

    handleGetInventory();
  }, [getInventory]);

  useEffect(() => {
    if (Array.isArray(inventory) && inventory.length && dishRecipe) {
      const handleGetSuggestions = async () => {
        await getDishSuggestions(dishRecipe, inventory);
      }

      handleGetSuggestions();
    }
  }, [dishRecipe, getDishSuggestions, inventory]);

  useEffect(() => {
    if (Array.isArray(inventory) && inventory.length && surpriseMe) {
      const handleGetInventorySuggestions = async () => {
        await getInventorySuggestions(inventory);
      }

      handleGetInventorySuggestions();
    }
  }, [getInventorySuggestions, inventory, surpriseMe]);
  
  const handleSurpriseMe = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setDish('');
    setSurpriseMe(true);
  }

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setDish('');
    await getDishRecipe(dish);
  };

  return (
    <div className="flex flex-grow items-center justify-center">
      {suggestedDishes === null && (
        <section className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">Your Kitchen Has Ingredients!</h1>
          <p className="text-lg text-gray-600 mb-4">What do you want to eat?</p>
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent border-solid"></div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <input
                type="search"
                inputMode="search"
                className="px-4 py-2 w-full md:w-1/2 min-w-[300px] border border-gray-500 bg-dark-gray placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter a dish..."
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                required
              />
              <button
                className="mt-6 px-4 py-2 bg-accent text-gray-300 hover:bg-accent-dark transition-transform duration-200 ease-in-out transform hover:scale-105 rounded-none"
                onClick={handleSurpriseMe}
              >
                Surprise Me
              </button>
              <p className="text-xs text-gray-400 mt-2">
              Clicking &quot;Surprise Me&quot; will provide a list of dishes based on what is in your kitchen.
              </p>
            </div>
          )}
        </section>
      )}

      {suggestedDishes !== null && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent border-solid"></div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="w-full p-6">
                <input
                  type="search"
                  inputMode="search"
                  className="px-4 py-2 w-full md:w-1/2 min-w-[300px] border border-gray-500 bg-dark-gray text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent mx-auto block"
                  placeholder="Enter another dish..."
                  value={dish}
                  onChange={(e) => setDish(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  required
                />
              </div>

              {suggestedDishes.suggestedDishes === null ? (
                <div className="text-center p-6">
                  <h2 className="text-2xl font-bold mb-2">You Have the Ingredients! 🎉</h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Your <span className="text-orange-600">{dishRecipe?.dish ?? 'dish'}</span>{` ${dishRecipe?.preparationTime === 'N/A' ? 'is ready right now' : `will be ready in about ${dishRecipe?.preparationTime}`}.`}
                  </p>
                  <h3 className="text-base font-bold">Go get your ingredients:</h3>
                  <span className="text-sm text-gray-600 text-wrap">
                    {suggestedDishes.originalDish?.ingredients?.join(', ').toUpperCase() ?? 'In your pantry, fridge, and spice drawer!'}
                  </span>
              </div>
              ) : (
                <>
                  <MissingIngredients {...suggestedDishes} />
                  <div className="flex flex-row flex-wrap justify-center gap-6 p-6">
                    {suggestedDishes.suggestedDishes.map((suggestion, index) => (
                      <SuggestionCard key={index} {...suggestion} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
