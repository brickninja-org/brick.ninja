export default function MarketingLayout({ children }: LayoutProps<'/[language]'>) {
  return (
    <>
      <div aria-hidden="true" className="gradient-background home-gradient-background"/>
      {children}
    </>
  );
}
