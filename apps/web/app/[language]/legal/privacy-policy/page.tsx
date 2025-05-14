import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { HeroLayout } from '@/components/layout/HeroLayout';

export default function PrivacyPolicyPage() {
  return (
    <HeroLayout hero={<Headline id="privacy-policy">Privacy Policy</Headline>} toc>
      <div className="max-w-full prose prose-neutral">
        <p>Last updated May 4, 2025</p>

        <p>At brick.ninja one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by brick.ninja and how we use it.</p>

        <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>

        <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in brick.ninja. This policy is not applicable to any information collected offline or via channels other than this website.</p>

        <Headline id="consent">Consent</Headline>
        <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
      </div>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Privacy Policy',
  description: 'Last updated May 4, 2025',
};
