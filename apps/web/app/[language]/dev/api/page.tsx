import { Code } from '@/components/layout/Code';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { Highlight } from '@/components/layout/Highlight';
import { getCurrentUrl } from '@/lib/url';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { ExternalLink } from '@brickninja-org/ui/components/link/ExternalLink';
import Link from 'next/link';

const exampleCodeFetchWithAuthorizationHeader =
`fetch('https://api.brick.ninja/items', {
  headers: {
    Authorization: \`Bearer \${apiKey}\`,
  },
})`;

export default async function DeveloperApiPage() {
  const apiUrl = await getCurrentUrl();
  apiUrl.hostname = `api.${process.env.BRICKNINJA_NEXT_DOMAIN}`;
  apiUrl.pathname = '/';

  return (
    <HeroLayout hero={<Headline id="api">API</Headline>} color="green" toc>
      <p>
        brick.ninja provides a public API. The API contains unique information about LEGO sets, parts and minifigures.
      </p>
      <p>
        The API is available at <ExternalLink target="_blank" href={apiUrl.toString()}><Code inline>{apiUrl.toString()}</Code></ExternalLink>.
      </p>

      <Headline id="authorization">API Key</Headline>
      <p>
        All requests to the brick.ninja API require an API key. This API key is used for per application rate limiting
        and versioning. Some endpoints may require approval before an application can use them in the future.
      </p>
      <p>
        First you have to <Link href="/dev/app/create">registeryour application</Link> to access the API key.
        You can view all your applications on the <Link href="/dev#applications">Developer page</Link>.
      </p>
      <p>
        The API key can be passed as header (<Code inline>Authorization: Bearer &lt;api-key&gt;</Code>) or as <Code inline>apiKey</Code> query parameter.
        Note that using the <Code inline>Authorization</Code> header to make a request from a browser will issue an
        additional <ExternalLink href="https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request">CORS preflight</ExternalLink> request,
        so you should prefer the query parameter when making client-side requests.
      </p>

      <Code><Highlight language="javascript" code={exampleCodeFetchWithAuthorizationHeader}/></Code>
    </HeroLayout>
  );
}
