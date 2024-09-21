import { SuggestedDishesType } from '@/types';
import { type NextRequest, NextResponse } from 'next/server';
import { initializeOpenAI, openai } from '../../openai.utils';

interface RequestBody {
  inventory: string[];
}

async function _getRecipeSuggestions(inventory: string[]): Promise<SuggestedDishesType | null> {
  try {
    const systemPrompt = process.env.INVENTORY_SUGGESTIONS_SYSTEM_PROMPT ?? '';
    const formattedPrompt = systemPrompt.replace('${inventory}', JSON.stringify(inventory));
    
    const response = await openai?.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: formattedPrompt },
      ],
      max_tokens: 1500
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
  initializeOpenAI();
  const { inventory }: RequestBody = await request.json();
  
  if (!Array.isArray(inventory) || !inventory.length) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const suggestedDishes = await _getRecipeSuggestions(inventory);
    if (!suggestedDishes) {
      return NextResponse.json({ error: 'Unable to generate recipe suggestions' }, { status: 404 });
    }
    
    return NextResponse.json(suggestedDishes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
