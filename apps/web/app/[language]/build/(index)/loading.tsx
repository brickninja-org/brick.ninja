import { SkeletonTable } from '@/components/skeleton/SkeletonTable';

export default function LoadingBuildPage() {
  return (
    <SkeletonTable columns={['Build', 'Item Updates', 'Product Updates', 'Date']}/>
  );
}
