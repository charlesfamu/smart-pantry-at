import { DishType, SuggestedDishesType } from '@/types';
// From scr/api/inventory/route.ts
// Pinecone API

export async function _getInventory(indexName: string): Promise<string[] | null> {
  try {
    const response = await fetch(`/api/inventory?indexName=${indexName}`);
    if (response instanceof Response && response.ok) {
      return await response.json();
    } else if (response instanceof Response) {
      // Handle non-OK HTTP responses
      throw new Error(response.statusText);
    } else {
      throw response;
    }
  } catch (error) {
    // console.error(error);
    return null;
  }
}

// From src/api/recipe/route.ts
// OpenAI API

export async function _getDishRecipe(dish: string): Promise<DishType | null> {
  try {
    const response = await fetch('/api/recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dish }),
    });

    if (response instanceof Response && response.ok) {
      return await response.json();
    } else if (response instanceof Response) {
      // Handle non-OK HTTP responses
      throw new Error(response.statusText);
    } else {
      throw response;
    }
  } catch (error) {
    // console.error(error);
    return null;
  }
}

// From src/api/recipe/dish-suggestions/route.ts
// Pinecone API and OpenAI API

export async function _getDishSuggestions(dishRecipe: DishType, inventory: string[], indexName: string): Promise<SuggestedDishesType | null> {
  try {
    const response = await fetch('/api/recipe/dish-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dishRecipe, indexName, inventory }),
    });

    if (response instanceof Response && response.ok) {
      return await response.json();
    } else if (response instanceof Response) {
      // Handle non-OK HTTP responses
      throw new Error(response.statusText);
    } else {
      throw response;
    }
  } catch (error) {
    // console.error(error);
    return null;
  }
}

// From src/api/recipe/inventory-suggestions/route.ts
// OpenAI API

export async function _getInventorySuggestions(inventory: string[]): Promise<SuggestedDishesType | null> {
  try {
    const response = await fetch('/api/recipe/inventory-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inventory }),
    });

    if (response instanceof Response && response.ok) {
      return await response.json();
    } else if (response instanceof Response) {
      // Handle non-OK HTTP responses
      throw new Error(response.statusText);
    } else {
      throw response;
    }
  } catch (error) {
    // console.error(error);
    return null;
  }
}