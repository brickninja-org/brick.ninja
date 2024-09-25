import { NextResponse, NextRequest } from 'next/server';

import type { Signed } from '@/components/item-table/query';
import type { ItemTableQuery, QueryModel } from '@/components/item-table/types';
import { loadItems, loadTotalItemCount, type ItemTableLoadOptions } from '@/components/item-table/item-table.actions';

export async function POST(request: NextRequest) {
  const body: {
    query: Signed<ItemTableQuery<QueryModel>>,
    options?: ItemTableLoadOptions<QueryModel>
  } = await request.json();

  if(request.nextUrl.searchParams.has('count')) {
    if(!body.query) {
      return new NextResponse(null, { status: 400 });
    }

    return NextResponse.json(await loadTotalItemCount(body.query));
  }

  if(!body.query || !body.options) {
    return new NextResponse(null, { status: 400 });
  }

  return NextResponse.json(await loadItems(body.query, body.options));
}
