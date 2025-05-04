import { NextResponse } from 'next/server';

import type { UnwrapJsonResponse } from '../helper';
import { searchItems, searchProducts, splitSearchTerms } from './helper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchValue = searchParams.get('q') ?? '';

  const terms = splitSearchTerms(searchValue);

  const [items, products] = await Promise.all([
    searchItems(terms),
    searchProducts(terms),
  ]);

  return NextResponse.json({ searchValue, terms, items, ...products });
}

export type ApiSearchResponse = UnwrapJsonResponse<ReturnType<typeof GET>>;
