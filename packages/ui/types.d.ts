/// <reference types="react-dom/canary" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties {
    // add known custom properties
    '--icon-size'?: `${string}px`;
    '--icon-color'?: CSS.Property.Color,

    // allow all custom properties
    [index: `--${string}`]: string | number;
  }
}
