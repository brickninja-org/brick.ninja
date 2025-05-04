import type { UnwrapJsonResponse } from '../../helper';
import type { ItemFilters } from '../../search/helper';

import { NextResponse } from 'next/server';

import { searchItems, splitSearchTerms } from '../../search/helper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchValue = searchParams.get('q') ?? '';

  const terms = splitSearchTerms(searchValue);

  const filter = {
    type: searchParams.has('type') ? JSON.parse(searchParams.get('type')!) : undefined,
    subtype: searchParams.has('subtype') ? JSON.parse(searchParams.get('subtype')!) : undefined,
  } as ItemFilters;

  const items = await searchItems(terms, filter);

  return NextResponse.json({ items });
}

export type ApiItemSearchResponse = UnwrapJsonResponse<ReturnType<typeof GET>>;
