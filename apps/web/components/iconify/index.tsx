import gravityIcons from '@iconify-json/gravity-ui/icons.json';

export type IconName = keyof typeof gravityIcons.icons;

export type IconProp = IconName | React.JSX.Element;

export * from './iconify.client';
