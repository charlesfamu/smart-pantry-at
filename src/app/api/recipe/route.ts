// app/api/recipe/route.ts

import { DishType } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { initializeOpenAI, openai } from '../openai.utils';

async function _getDishRecipeChatCompletion(dish: string): Promise<DishType | null | { error: string; }> {
  try {
    const dishRecipeSystemPrompt = process.env.DISH_RECIPE_SYSTEM_PROMPT ?? '';
    const response = await openai?.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: dishRecipeSystemPrompt,
        },
        { 
          role: 'user', 
          content: `What are the ingredients for ${dish}?`
        }
      ],
      max_tokens: 500,
      response_format: {
        'type': 'json_object'
      },
      top_p: 0.1,
    });    
    
    const content = response?.choices[0].message?.content ?? '';
    return content 
      ? JSON.parse(content)
      : null;
    
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  initializeOpenAI();
  const { dish }: { dish: string; } = await request.json();
  if (!dish) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  try {
    const dishRecipe = await _getDishRecipeChatCompletion(dish);
    if (!dishRecipe) {
      return NextResponse.json({ error: 'Error fetching dish recipe' }, { status: 404 });
    } else if (dishRecipe && 'error' in dishRecipe) {
      return NextResponse.json(dishRecipe, { status: 400 });
    } 
    return NextResponse.json(dishRecipe, { status: 200 });
  } catch (error) {
    console.error('Error parsing response:', error);
    return NextResponse.json({ error: 'Error parsing response' }, { status: 500 });
  }
}
