import type { LayoutProps } from '@/lib/next';

export default function MarketingLayout({ children }: LayoutProps) {
  return (
    <>
      <div aria-hidden="true" className="gradient-background home-gradient-background"/>
      {children}
    </>
  );
}
