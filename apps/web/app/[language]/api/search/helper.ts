import type { Prisma } from '@brickninja-org/database';

import { isDefined, isTruthy } from '@brickninja-org/helper/is';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';

export function splitSearchTerms(query: string): string[] {
  const terms = Array.from(query.matchAll(/"(?:\\\\.|[^\\\\"])+"|\S+/g)).map((term) => {
    return unpackQuotes(term[0])
      .replaceAll('\\\\', '\\')
      .replaceAll('\\"', '"')
      .replaceAll('%', '\\%');
  });

  return terms;
}

function unpackQuotes(value: string): string {
  if(value.at(0) === '"' && value.at(-1) === '"') {
    return value.substring(1, value.length - 1);
  }

  return value;
}

function toNumber(value: string): number | undefined {
  const number = Number(value);

  if(number.toFixed() === value && number > 0) {
    return number;
  }

  return undefined;
}

type LocalizedNameInput = {
  AND?: LocalizedNameInput[];
  OR?: LocalizedNameInput[];
  name_de?: Prisma.StringFilter | string;
  name_en?: Prisma.StringFilter | string;
  name_es?: Prisma.StringFilter | string;
  name_fr?: Prisma.StringFilter | string;
  name_nl?: Prisma.StringFilter | string;
};

function nameQuery(terms: string[]): LocalizedNameInput[] {
  if(terms.length === 0) {
    return [];
  }

  const nameQueries: LocalizedNameInput[] = ['en', 'nl'].map((lang) => ({
    AND: terms.map((term) => ({ [`name_${lang}`]: { contains: term, mode: 'insensitive' }}))
  }));

  return nameQueries;
}

export type ItemFilters = {
  iconId?: number | null,
  type?: string,
  subtype?: string | null,
};

export const searchItems = cache(async (terms: string[], filter?: ItemFilters) => {
  const nameQueries = nameQuery(terms);

  const numberTerms = terms.map(toNumber).filter(isTruthy);

  const joinedTerms = terms.join(' ');
  const exactWhere = [
    filter,
    {
      OR: [
        { name_de: { equals: joinedTerms, mode: 'insensitive' as const }},
        { name_en: { equals: joinedTerms, mode: 'insensitive' as const }},
        { name_es: { equals: joinedTerms, mode: 'insensitive' as const }},
        { name_fr: { equals: joinedTerms, mode: 'insensitive' as const }},
        { name_nl: { equals: joinedTerms, mode: 'insensitive' as const }},
        { id: { in: numberTerms }},
      ],
    },
  ].filter(isDefined);

  const containsTermsWhere = [
    filter,
    terms.length > 0 ? { OR: nameQueries } : undefined
  ].filter(isDefined);

  // get exact name matches first (only search if we are actually filtering for something)
  const exactNameMatches = terms.length > 0 ? await db.item.findMany({
    where: { AND: exactWhere },
    take: 50,
    include: { icon: true },
    orderBy: { relevancy: 'desc' }
  }) : [];

  // if we have less then 5 exact matches, we fill the remainder with items that just contain the search terms
  const termMatches = exactNameMatches.length < 5 ? await db.item.findMany({
    where: { AND: [...containsTermsWhere, { id: { notIn: exactNameMatches.map(({ id }) => id) }}] },
    take: 5 - exactNameMatches.length,
    include: { icon: true },
    orderBy: { relevancy: 'desc' }
  }) : [];

  return [...exactNameMatches, ...termMatches];
}, ['search', 'search-items'], { revalidate: 60 });

export const searchProducts = cache(async (terms: string[]) => {
  const nameQueries = nameQuery(terms);
  const numberTerms = terms.map(toNumber).filter(isTruthy);

  const [products, productCategories] = await Promise.all([
    db.product.findMany({
      where: terms.length > 0 ? { OR: [...nameQueries, { id: { in: numberTerms }}] } : undefined,
      take: 5,
      include: { icon: true, categories: true },
      orderBy: { views: 'desc' },
    }),
    db.productCategory.findMany({
      where: terms.length > 0 ? { OR: nameQueries } : undefined,
      take: 5,
    })
  ]);

 return { products, productCategories };
}, ['search', 'search-products'], { revalidate: 60 });
