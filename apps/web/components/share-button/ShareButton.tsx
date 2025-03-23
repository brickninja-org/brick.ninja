'use client';

import type { FC } from 'react';
import type { ButtonProps } from "@brickninja-org/ui/components/form/Button";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@brickninja-org/ui/components/form/Button";

export interface ShareButtonProps {
  data: ShareData;
  appearance?: ButtonProps['appearance'];
  flex?: ButtonProps['flex'];
}

export const ShareButton: FC<ShareButtonProps> = ({ data, appearance, flex }) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => setCanShare(navigator.canShare?.(data) ?? false), [data]);

  const handleShare = useCallback(() => {
    navigator.share(data);
  }, [data]);

  if (!canShare) {
    return null;
  }

  return (
    <Button appearance={appearance} flex={flex} onClick={handleShare} icon="external">
      Share
    </Button>
  )
};
