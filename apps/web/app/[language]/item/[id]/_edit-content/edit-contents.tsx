'use client';

import { useCallback, useEffect, useState, type FC } from 'react';
import NextLink from 'next/link';

import { Button, type ButtonProps } from '@brickninja-org/ui/components/form/button';
import { Dialog, DialogActions } from '@brickninja-org/ui/components/dialog';
import { Notice } from '@brickninja-org/ui/components/notice';

import { Skeleton } from '@/components/skeleton';

import type { CanSubmitResponse, EditContentSubmitError } from './types';
import { canSubmit, submitToReview } from './actions';

export interface EditContentsProps {
  apperance: ButtonProps['appearance'];
  itemId: number;
}

export const EditContents: FC<EditContentsProps> = ({ apperance, itemId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [canSubmitState, setCanSubmitState] = useState<CanSubmitResponse>();
  const [error, setError] = useState<EditContentSubmitError>();

  useEffect(() => {
    if (dialogOpen) {
      setCanSubmitState(undefined);
      canSubmit(itemId).then(setCanSubmitState);
    }
  }, [dialogOpen, itemId]);

  const toggleDialog = useCallback(() => {
    setDialogOpen((open) => !open);
  }, [setDialogOpen]);

  const handleSubmit = useCallback(async () => {
    setError(undefined);
    const submitted = await submitToReview({ itemId });

    if (submitted === true) {
      setDialogOpen(false);
    } else {
      setError(submitted);
    }
  }, [itemId]);

  return (
    <>
      <Button appearance={apperance} onClick={toggleDialog}>Edit Content</Button>
      <Dialog open={dialogOpen} onClose={toggleDialog} title="Edit Contents">
        {canSubmitState === undefined ? (
          <Skeleton/>
        ) : canSubmitState.canSubmit === false ? (
          canSubmitState.reason === 'LOGIN' ? (<p>You need to <NextLink href={`/login?returnTo=${encodeURIComponent(`/item/${itemId}`)}`}>Login</NextLink> to submit changes.</p>) :
          canSubmitState.reason === 'PENDING_REVIEW' ? (
            canSubmitState.ownReview
              ? (<p>You must wait for your <NextLink href={`/review/container-content/${canSubmitState.reviewId}`}>suggested change</NextLink> to be reviewed before you can submit another change.</p>)
              : (<p>There is already a suggested change for this item. You can <NextLink href={`/review/container-content/${canSubmitState.reviewId}`}>review the change now</NextLink>.</p>)
          ) :
          (<p>Unknown error</p>)
        ) : (
          <>
            {error && <Notice color="error">Your changes could not be saved ({error}).</Notice>}
            <p>Noticed something wrong with the contents of this item? You can remove and add items in this dialog.</p>

            <DialogActions description="Your changes will be reviewed before they are applied.">
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};
