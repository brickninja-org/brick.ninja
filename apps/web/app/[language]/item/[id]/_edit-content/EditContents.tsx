'use client';

import type { FC } from 'react';
import type { Content, Item } from '@brickninja-org/database';
import type { ButtonProps } from '@brickninja-org/ui/components/form/Button';
import type { LocalizedEntity } from '@/lib/localized-name';
import type { WithIcon } from '@/lib/with';
import type { SearchItemDialogSubmitHandler } from '@/components/item/SearchItemDialog';
import type { AddedItem, CanSubmitResponse, EditContentSubmitError } from './types';

import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';

import { Dialog } from '@brickninja-org/ui/components/dialog/Dialog';
import { DialogActions } from '@brickninja-org/ui/components/dialog/DialogActions';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { NumberInput } from '@brickninja-org/ui/components/form/NumberInput';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { Table } from '@brickninja-org/ui/components/table/Table';
import { TableRowButton } from '@brickninja-org/ui/components/table/TableRowButton';
import { Icon } from '@brickninja-org/ui/icons';

import { toggleArray } from '@/lib/toggle-array';
import { FormatNumber } from '@/components/format/FormatNumber';
import { SearchItemDialog } from '@/components/item/SearchItemDialog';
import { ItemLink } from '@/components/item/ItemLink';
import { Skeleton } from '@/components/skeleton/Skeleton';

import { canSubmit, submitToReview } from './actions';

export interface EditContentsProps {
  appearance?: ButtonProps['appearance'],
  itemId: number,
  contents: (Content & {
    contentItem: WithIcon<Pick<Item, 'id' | keyof LocalizedEntity>>,
  })[],
}

export const EditContents: FC<EditContentsProps> = ({ itemId, contents, appearance }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchItemDialogOpen, setSearchItemDialogOpen] = useState(false);
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

  const [removedItems, setRemovedItems] = useState<number[]>([]);
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);

  const addItem: SearchItemDialogSubmitHandler = useCallback((item) => {
    setSearchItemDialogOpen(false);

    if (item) {
      setAddedItems((added) => [...added, { _id: crypto.randomUUID(), item, quantity: 1 }]);
    }
  }, [setAddedItems]);

  const handleSubmit = useCallback(async () => {
    setError(undefined);
    const submitted = await submitToReview({ itemId, removedItems, addedItems });

    if (submitted === true) {
      setDialogOpen(false);
    } else {
      setError(submitted);
    }
  }, [itemId, removedItems, addedItems]);

  return (
    <>
      <Button appearance={appearance} onClick={toggleDialog}>Edit Content</Button>
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
            {error && <Notice type="error">Your changes could not be saved ({error}).</Notice>}
            <p>Noticed something wrong with the contents of this item? You can remove and add items in this dialog.</p>
            <Headline id="items">Items</Headline>
            <Table>
              <thead>
                <tr>
                  <Table.HeaderCell>Item</Table.HeaderCell>
                  <Table.HeaderCell align="end">Item ID</Table.HeaderCell>
                  <Table.HeaderCell align="end">Quantity</Table.HeaderCell>
                  <Table.HeaderCell small>Action</Table.HeaderCell>
                </tr>
              </thead>
              <tbody>
                {contents.map((content) => {
                  const isRemoved = removedItems.includes(content.contentItemId);

                  return (
                    <tr key={content.contentItemId} data-removed={isRemoved || undefined}>
                      <td><ItemLink item={content.contentItem}/></td>
                      <td>{content.contentItemId}</td>
                      <td><FormatNumber value={content.quantity}/></td>
                      <td><Button appearance="secondary" onClick={() => setRemovedItems(toggleArray(content.contentItemId))}>{isRemoved ? 'Revert' : 'Remove'}</Button></td>
                    </tr>
                  );
                })}
                {addedItems.map((added) => {
                  const edit = (update: Partial<AddedItem>) => {
                    setAddedItems((items) => items.map((a) => a._id === added._id ? { ...a, ...update } : a));
                  };

                  return (
                    <tr key={added._id} data-added>
                      <td><ItemLink item={added.item}/></td>
                      <td>{added.item.id}</td>
                      <td><NumberInput value={added.quantity} onChange={(quantity) => edit({ quantity })}/></td>
                      <td><Button appearance="secondary" onClick={() => setAddedItems((items) => items.filter(({ _id }) => _id !== added._id))}>Remove</Button></td>
                    </tr>
                  );
                })}
                <TableRowButton onClick={() => setSearchItemDialogOpen(true)}>
                  <Icon icon="add"/> Add Item
                </TableRowButton>
              </tbody>
            </Table>
            <SearchItemDialog onSubmitAction={addItem} open={searchItemDialogOpen}/>

            <DialogActions description="Your changes will be reviewed before they are applied.">
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};
