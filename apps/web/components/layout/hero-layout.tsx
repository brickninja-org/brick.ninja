import type { FC, ReactNode } from "react";

import {tv, type VariantProps} from "tailwind-variants";

import { PageLayout } from "./page-layout";

export interface HeroLayoutProps extends HeroVariants {
  children: ReactNode;
  hero: ReactNode;
  toc?: boolean;
  skipPreload?: boolean;
}

const styles = tv({
  base: "relative -mt-[1px] py-8 px-4 border-b border-transparent",
  variants: {
    color: {
      blue: "bg-blue-800 text-white",
      green: "bg-green-800 text-white",
      red: "bg-red-800 text-white",
    },
  },
  defaultVariants: {
    color: "red"
  },
});

type HeroVariants = VariantProps<typeof styles>;

export const HeroLayout: FC<HeroLayoutProps> = ({children, hero, toc, skipPreload, color}) => {
  return (
    <div>
      <div className={styles({color})}>{hero}</div>
      <PageLayout toc={toc}>{children}</PageLayout>
    </div>
  )
};
