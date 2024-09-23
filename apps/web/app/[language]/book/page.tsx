import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import { Language } from '@brickninja-org/database';
import { Headline } from '@brickninja-org/ui/components/headline';
import { Table } from '@brickninja-org/ui/components/table';

import { localizedName } from '@/lib/localized-name';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/layout/hero-layout';

const getBooks = unstable_cache((language: Language) => {
  return db.item.findMany({
    where: { type: 'Book' },
    select: {
      id: true,
      name_en: language === 'en',
      name_nl: language === 'nl',
      productCode: true,
    },
    orderBy: { productCode: 'asc' },
  });
}, ['get-books']);

export default async function BookPage({ params }: PageProps) {
  const books = await getBooks(params.language);

  return (
    <HeroLayout hero={<Headline id="books">Books</Headline>} color="yellow">
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small align="right">ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td align="right">{book.productCode}</td>
              <td>{localizedName(book, params.language)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </HeroLayout>
  );
}

export const metadata: Metadata = {
  title: 'Books',
};
