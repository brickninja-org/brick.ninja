import type { Language } from '@brickninja-org/database';
import type { PageProps } from '@/lib/next';

import { unstable_cache } from 'next/cache';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';

import { compareLocalizedName, localizedName } from '@/lib/localized-name';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import { Translate } from '@/components/i18n/Translate';
import { Description } from '@/components/layout/Description';
import { ColumnSelect } from '@/components/table/ColumnSelect';
import { DyeColor } from '@/components/color/DyeColor';
import { hexToRgb } from '@/components/color/hex-to-rgb';

const getColors = unstable_cache((language: Language) => {
  return db.color.findMany({
    select: {
      id: true,
      name_en: language === 'en',
      name_nl: language === 'nl',
      color_family: true,
      plastic_code: true,
    },
    orderBy: { id: 'asc' },
  });
}, ['get-colors']);

export default async function ColorsPage({ params }: PageProps) {
  const { language } = await params;
  const colors = await getColors(language);

  const Colors = createDataTable(colors, ({ id }) => id);

  return (
    <>
      <Description actions={<ColumnSelect table={Colors}/>}>
        <Translate id="colors.description"/>
      </Description>
   
      <Colors.Table>
        <Colors.Column id="id" title={<Translate id="itemTable.column.id"/>} align="end" small hidden>
          {({ id }) => id}
        </Colors.Column>
        <Colors.Column id="name" title={<Translate id="itemTable.column.name"/>} sort={compareLocalizedName(language)}>
          {(name) => localizedName(name, language)}
        </Colors.Column>
        <Colors.Column id="family" title={<Translate id="colors.family"/>} sortBy="color_family">
          {({ color_family }) => color_family}
        </Colors.Column>
        <Colors.Column id="plastic" title={<Translate id="colors.plastic"/>} small>
          {({ plastic_code }) => <DyeColor color={hexToRgb(plastic_code)}/>}
        </Colors.Column>
      </Colors.Table>
    </>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('catalog.colors'),
    description: t('catalog.colors.description'),
  };
});
