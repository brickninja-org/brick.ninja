import type { LocalizedEntity } from '@/lib/localized-name';
import type { WithIcon } from '@/lib/with';

export interface AddedItem {
  _id: string;
  item: WithIcon<{
    id: number;
  } & LocalizedEntity>;
  quantity: number;
}

export interface EditContentOrder {
  removedItems: number[];
  addedItems: AddedItem[];
}

export enum EditContentSubmitError {
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  LOGIN = 'LOGIN',
  NO_CHANGES = 'NO_CHANGES',
  PENDING_REVIEW = 'PENDING_REVIEW',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

export type CanSubmitResponse =
  { canSubmit: true, userId: string } |
  { canSubmit: false, reason: EditContentSubmitError.LOGIN } |
  { canSubmit: false, reason: EditContentSubmitError.PENDING_REVIEW, reviewId: string, ownReview: boolean };
