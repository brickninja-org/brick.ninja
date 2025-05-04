import DetailLayout from '@/components/layout/DetailLayout';
import { Skeleton } from '@/components/skeleton/Skeleton';

export default function LoadingProduct() {
  return (
    <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>
  );
}
