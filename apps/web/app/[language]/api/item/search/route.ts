import { NextResponse } from 'next/server';

import type { UnwrapJsonResponse } from '../../helper';
import { searchItems, splitSearchTerms } from './helper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchValue = searchParams.get('q') ?? '';

  const terms = splitSearchTerms(searchValue);
  const [items] = await Promise.all([
    searchItems(terms),
  ]);

  return NextResponse.json({ searchValue, terms, items });
}

export type ApiItemSearchResponse = UnwrapJsonResponse<ReturnType<typeof GET>>;
