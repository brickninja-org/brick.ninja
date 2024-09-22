import type { FC } from 'react';
import type { Item, Language } from '@brickninja-org/database';
import type { GetSets } from '@brickset-api/types/data/get-sets';

import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { LinkButton } from '@brickninja-org/ui/components/form/button';
import { Headline } from '@brickninja-org/ui/components/headline';

import { LanguageLinks } from '@/components/info-box/language-links';
import { ItemLink } from '@/components/item/item-link';
import { PriceGuide } from '../info-box/price-guide';

interface ItemInfoboxProps {
  item: Item;
  data: GetSets;
  language: Language;
}

export const ItemInfobox: FC<ItemInfoboxProps> = ({ item, data, language }) => {
  return (
    <div>
      <LanguageLinks language={language} link={<ItemLink item={item}/>}/>

      <Headline id="price-guide" noToc>Price Guide</Headline>
      <PriceGuide data={data}/>

      <Headline id="links" noToc>Links</Headline>
      <FlexRow wrap>
        {/* <LinkButton appearance="tertiary" flex external href={`https://brickset.com/api/v3.asmx/getSets?apiKey=${process.env.BRICKSET_API_KEY}&userHash=&params={setID=${item.id}}`} target="api">API</LinkButton> */}
        <LinkButton appearance="tertiary" flex external href={`https://www.lego.com/product/${data.number}`} target="product">LEGO.com</LinkButton>
      </FlexRow>
    </div>
  );
};
