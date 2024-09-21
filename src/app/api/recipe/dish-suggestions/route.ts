// src/app/api/recipe/dish-suggestions/route.ts

import { DishType, SuggestedDishesType } from '@/types';
import { type NextRequest, NextResponse } from 'next/server';
import { initializeOpenAI, openai } from '../../openai.utils';
import {
  IndexNameMappings,
  initializePinecone,
  pinecone,
  PineconeNamespaces,
  ValidRequestIndicies
} from '../../pinecone.utils';

interface RequestBody {
  dishRecipe: DishType;
  indexName?: string;
  inventory: string[];
}

async function _getEmbedding(text: string): Promise<number[] | null> {
  try {
    const response = await openai?.embeddings.create({
      model: 'text-embedding-3-small',
      input: [text]
    });

    return response?.data[0].embedding ?? null;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

type MatchingIngredientType = {
  dishIngredient: string;
  inventoryIngredient: string;
}

async function _semanticSearch(dishIngredients: string[], pineconeIndex: string): Promise<MatchingIngredientType[] | null> {
  let matches: MatchingIngredientType[] = [];

  try {
    const index = pinecone?.index(pineconeIndex);
    const namespaces = Object.values(PineconeNamespaces);
    for (const ingredient of dishIngredients) {
      const vector = await _getEmbedding(ingredient);
      for (const namespace of namespaces) {
        if (vector) {
          const queryResponse = await index?.namespace(namespace).query({
            vector,
            topK: 100,
            includeMetadata: true,
          });

          if (queryResponse?.matches) {
            matches = queryResponse.matches.reduce((acc, item) => {
              if (item.score !== undefined && item.score > 0.51) {
                acc.push({
                  dishIngredient: ingredient,
                  inventoryIngredient: item.id ?? ''
                });
              }
              return acc;
            }, [...matches]);
          }
        }
      }
    }
    return matches;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function _getFinalSuggestion(dishRecipe: DishType, missingIngredients: string[], inventory: string[]): Promise<SuggestedDishesType | null> {
  try {
    const dishIngredients = dishRecipe.ingredients.map((ingredient) => ingredient.name);
    const systemPrompt = process.env.DISH_SUGGESTION_SYSTEM_PROMPT ?? '';
    const userPromptTemplate = process.env.DISH_SUGGESTION_USER_PROMPT_TEMPLATE ?? '';

    // Replacing placeholders in userInput with actual data
    const userPrompt = userPromptTemplate
      .replace('{inventory}', JSON.stringify(inventory))
      .replace('{dishIngredients}', JSON.stringify(dishIngredients))
      .replace('{dish}', dishRecipe.dish)
      .replace('{missingIngredients}', JSON.stringify(missingIngredients));

    const response = await openai?.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        { 
          role: 'user', 
          content: userPrompt, 
        }
      ],
      max_tokens: 1500,
      response_format: {
        'type': 'json_object'
      },
    });

    const content = response?.choices[0].message?.content ?? '';
    return content 
      ? (JSON.parse(content) as SuggestedDishesType)
      : null;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const { dishRecipe, inventory, indexName }: RequestBody = await request.json();
  if (dishRecipe && 'error' in dishRecipe) {
    return NextResponse.json(dishRecipe, { status: 400 });
  }

  if (!Array.isArray(inventory) || !inventory?.length || !dishRecipe) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  initializeOpenAI();
  initializePinecone();

  const validIndexName = indexName && Object.values(ValidRequestIndicies).includes(indexName as ValidRequestIndicies);
    const pineconeIndex = validIndexName 
      ? IndexNameMappings[indexName as keyof typeof IndexNameMappings]
      : IndexNameMappings.Prowings;

  try {
    const dishIngredients = dishRecipe.ingredients.map((ingredient) => ingredient.name);
    const matchedIngredients = await _semanticSearch(dishIngredients, pineconeIndex);
    const set = new Set(matchedIngredients?.map((ingredient) => ingredient.dishIngredient) ?? []);
    const missingIngredients = dishIngredients.filter((ingredient) => { 
      return !set.has(ingredient);
    });
    const suggestedDishes = await _getFinalSuggestion(dishRecipe, missingIngredients, inventory);
    if (!suggestedDishes) {
      return NextResponse.json({ error: 'Unable to generate final suggestion' }, { status: 404 });
    }
    return NextResponse.json(suggestedDishes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
