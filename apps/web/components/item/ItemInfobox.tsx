import type { FC } from 'react';
import type { Item, Language } from '@brickninja-org/database';
import type { GetSets } from '@brickset-api/types/data/get-sets';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { translateMany } from '@/lib/translate';
import { LanguageLinks } from '@/components/info-box/LanguageLinks';
import { ItemLink } from '@/components/item/ItemLink';
import { PriceGuide } from '@/components/item/PriceGuide';
import { FormatNumber } from '../format/FormatNumber';
import { ShareButton } from '../share-button/ShareButton';
import { localizedName } from '@/lib/localized-name';
import { getCurrentUrl } from '@/lib/url';

const TOTAL_COUNT_BRICKSET_USERS = 335274;

interface ItemInfoboxProps {
  item: Item;
  data: GetSets;
  language: Language;
}

export const ItemInfobox: FC<ItemInfoboxProps> = async ({ item, data, language }) => {
  const currentUrl = await getCurrentUrl();

  const priceGuideTranslations = translateMany([
    'priceGuide.official_price',
    'priceGuide.per_piece',
  ], language);

  return (
    <div>
      <LanguageLinks language={language} link={<ItemLink item={item}/>}/>

      <Headline id="price-guide" noToc>Price Guide</Headline>
      <PriceGuide data={data} translations={priceGuideTranslations}/>

      <Headline id="links" noToc>Links</Headline>
      <FlexRow wrap>
        {/* <LinkButton appearance="tertiary" flex external href={`https://brickset.com/api/v3.asmx/getSets?apiKey=${process.env.BRICKSET_API_KEY}&userHash=&params={setID=${item.id}}`} target="api">API</LinkButton> */}
        <LinkButton appearance="tertiary" flex external href={`https://www.lego.com/product/${data.number}`} target="product">LEGO.com</LinkButton>
        <ShareButton appearance="tertiary" flex data={{ title: localizedName(item, language), url: currentUrl.toString() }}/>
      </FlexRow>

      {data.collections?.ownedBy && data.collections.ownedBy > 0 && (
        <>
          <Headline id="collections" noToc>Collections</Headline>
          <p>Owned by <FormatNumber value={data.collections.ownedBy / TOTAL_COUNT_BRICKSET_USERS} options={{ style: 'percent', maximumFractionDigits: 3 }}/> of users on Brickset.com</p>
        </>
      )}
    </div>
  );
};
