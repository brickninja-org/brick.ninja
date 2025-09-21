import type { FC } from 'react';
import type { Item, Language } from '@brickninja-org/database';
import type { Item as ApiItem } from '@brickninjaapi/types/data/item';
//import type { GetSets } from '@brickset-api/types/data/get-sets';

import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { localizedName } from '@/lib/localized-name';
import { getCurrentUrl } from '@/lib/url';
import { LinkButton, ShareButton } from '@/components/button';
import { Iconify } from '@/components/iconify';
import { LanguageLinks } from '@/components/info-box/LanguageLinks';
import { ItemLink } from '@/components/item/ItemLink';

// const TOTAL_COUNT_BRICKSET_USERS = 335274;

interface ItemInfoboxProps {
  item: Item,
  data: ApiItem,
  language: Language,
}

export const ItemInfobox: FC<ItemInfoboxProps> = async ({ item, data, language }) => {
  const currentUrl = await getCurrentUrl();

  return (
    <div>
      <LanguageLinks language={language} link={<ItemLink icon="none" item={item}/>}/>

      <Headline id="links" noToc>Links</Headline>
      <FlexRow wrap>
        {/* <LinkButton appearance="tertiary" flex external href={`https://brickset.com/api/v3.asmx/getSets?apiKey=${process.env.BRICKSET_API_KEY}&userHash=&params={setID=${item.id}}`} target="api">API</LinkButton> */}
        <LinkButton
          className="flex-1 rounded-sm"
          href={`https://www.lego.com${item.type === 'Container' && data.default_product ? `/product/${data.default_product.toString()}` : item.subtype === 'Instruction' ? `/cdn/product-assets/product.bi.core.pdf/${item.id}.pdf` : `/pick-and-build/pick-a-brick?query=${item.id}`}`}
          rel="noopener noreferrer"
          target="_blank"
          variant="tertiary"
        >
          <Iconify icon="arrow-up-right-from-square"/>
          LEGO.com
        </LinkButton>
        <ShareButton className="flex-1 rounded-sm" variant="tertiary" data={{ title: localizedName(item, language), url: currentUrl.toString() }}/>
      </FlexRow>

      {/* data.collections?.ownedBy && data.collections.ownedBy > 0 && (
        <>
          <Headline id="collections" noToc>Collections</Headline>
          <p>Owned by <FormatNumber value={data.collections.ownedBy / TOTAL_COUNT_BRICKSET_USERS} options={{ style: 'percent', maximumFractionDigits: 3 }}/> of users on Brickset.com</p>
        </>
      ) */}
    </div>
  );
};
