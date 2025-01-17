import en from '../../../dictionary/en.json';
import nl from '../../../dictionary/nl.json';

import Link from 'next/link';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { List } from '@brickninja-org/ui/components/layout/List';

import { PageLayout } from '@/components/layout/PageLayout';

import { TranslationEditor } from './TranslationEditor';

const dictionaries = { en, nl };

export default function TranslatePage() {
  return (
    <PageLayout>
      <Headline id="translations">Translations</Headline>

      <List numbered>
        <li>
          Edit Translations by clicking on them.
          <List>
            <li>Missing translations are displayed in italics and gray.</li>
            <li>Translations you changed are bold and blue.</li>
          </List>
        </li>
        <li>
          Once you have made your changes to the translations, you need to export them.
          <List>
            <li>Click the &quot;Export&quot; button at the top of the table. This will download a JSON file containing all translations of that language.</li>
            <li>If you have edited multiple languages, export all languages you have changed.</li>
          </List>
        </li>
        <li>
          Submit your changes.
          <List>
            <li>If you know how to use GitHub, you can create a Pull Request with your changes (<Link href="https://github.com/brickninja-org/brick.ninja/tree/main/apps/web/dictionary">GitHub translations directory</Link>).</li>
            <li>Otherwise send the file with your changes in an email to <a href="mailto:support@brick.ninja">support@brick.ninja</a>.</li>
          </List>
        </li>
      </List>

      <p>If you found a wrong text on the site that is not listed here, it is probably not translated yet. Check the <Link href="/about">About page</Link> on how to report this or contribute the changes yourself.</p>

      <TranslationEditor dictionaries={dictionaries}/>
    </PageLayout>
  );
}
