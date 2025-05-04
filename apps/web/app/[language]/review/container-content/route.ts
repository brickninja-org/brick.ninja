import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import { ReviewQueue } from '@brickninja-org/database';

import { getRandomReviewId } from '../random';

export async function GET(request: NextRequest): Promise<never> {
  const skip = request.nextUrl.searchParams.get('skip') || undefined;

  const id = await getRandomReviewId(ReviewQueue.ContainerContent, skip);
  if (!id) {
    redirect('/review');
  }

  redirect(`/review/container-content/${id}`);
}
