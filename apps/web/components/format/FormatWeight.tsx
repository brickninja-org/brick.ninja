'use client';

import { useFormatContext } from './Format.context';
import { FormatNumber } from './FormatNumber';

export function FormatWeight({ grams }: { grams: number }) {
  const { region } = useFormatContext();

  const isImperial = region === 'us' || region === 'gb';
  const unit = isImperial ? 'pound' : 'kilogram';
  const value = isImperial
    ? (grams / 453.59237).toFixed(2) // Convert grams to pounds
    : (grams / 1000).toFixed(2); // Convert grams to kilograms

  return (
    <FormatNumber
      value={parseFloat(value)}
      options={{
        style: 'unit',
        unit,
        unitDisplay: 'short',
        maximumFractionDigits: 2,
      }}/>
  );
}
