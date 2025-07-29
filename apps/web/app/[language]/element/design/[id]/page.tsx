import { cache } from '@/lib/cache';
import type { PageProps } from '@/lib/next';
import { pageView } from '@/lib/page-view';
import { db } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { ElementDesign } from '@brickninjaapi/types/data/element-design';
import DetailLayout from '@/components/layout/DetailLayout';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Json } from '@/components/format/Json';
import { ItemTableContext } from '@/components/item-table/ItemTable.context';
import { ItemTableColumnsButton } from '@/components/item-table/ItemTableColumnsButton';
import { ItemTable } from '@/components/item-table/ItemTable';

const getElementDesign = cache(async(id: number) => {
  const [design, revision] = await Promise.all([
    db.elementDesign.findUnique({
      where: { id },
    }),
    db.revision.findFirst({ where: { currentDesign: { id }}}),
  ]);

  if (!design || !revision) {
    notFound();
  }

  return { design, revision };
}, ['get-element-design'], { revalidate: 60 });

type ElementDesignPageProps = PageProps<{ id: string }>;

async function ElementDesignPage({ params }: ElementDesignPageProps) {
  const { id } = await params;
  const designId = Number(id);

  const { revision } = await getElementDesign(designId);
  await pageView('design', designId);

  const data: ElementDesign = JSON.parse(revision.data);

  return (
    <DetailLayout
      title={data.name}
    >
      <ItemTableContext id="elements">
        <Headline id="items" actions={<ItemTableColumnsButton/>}>Elements</Headline>
        <ItemTable query={{ where: { designs: { some: { id: designId }}}}} collapsed defaultColumns={['item', 'type']}/>
      </ItemTableContext>

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
}

export default ElementDesignPage;
