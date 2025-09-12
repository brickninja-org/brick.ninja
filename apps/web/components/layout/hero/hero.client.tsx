import type { ComponentProps } from 'react';
import type { HeroVariants } from './hero.styles';

import { createContext, useContext } from 'react';
import { heroVariants } from './hero.styles';

type HeroContext = {
  slots?: ReturnType<typeof heroVariants>;
};

const HeroContext = createContext<HeroContext>({});

interface HeroRootProps extends Omit<ComponentProps<'div'>, 'color'>, HeroVariants {}

const Hero = ({ children, className, color, ...props }: HeroRootProps) => {
  const slots = heroVariants({ color });
  return (
    <HeroContext.Provider value={{ slots }}>
      <div className={slots?.base({ className })} {...props}>
        {children}
      </div>
    </HeroContext.Provider>
  );
};

type HeroContentProps = ComponentProps<'div'>;

const HeroContent = ({ children, className, ...props }: HeroContentProps) => {
  const { slots } = useContext(HeroContext);
  return (
    <div className={slots?.content({ className })} {...props}>
      {children}
    </div>
  );
};

const CompoundHero = Object.assign(Hero, {
  Content: HeroContent,
});

export default CompoundHero;
