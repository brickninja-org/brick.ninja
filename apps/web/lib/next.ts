/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ReactNode } from 'react';

import type { Language } from '@brickninja-org/database';

import type { SearchParams } from '@/lib/search-params';

type Params = Record<string, string | string[] | undefined>;

export interface PageProps<P extends Params = {}> {
  params: P & { language: Language };
  searchParams: SearchParams;
}

export interface LayoutProps<P extends Params = {}> {
  params: P & { language: Language };
  children: ReactNode;
}
