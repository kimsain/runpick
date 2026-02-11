import { getAllShoes } from '@/utils/shoe-utils';
import ShoeDetailClient from './ShoeDetailClient';

interface ShoeDetailPageProps {
  params: Promise<{ shoeId: string }>;
}

export function generateStaticParams() {
  const shoes = getAllShoes();
  return shoes.map((shoe) => ({
    shoeId: shoe.slug,
  }));
}

export default async function ShoeDetailPage({ params }: ShoeDetailPageProps) {
  const { shoeId } = await params;
  return <ShoeDetailClient shoeId={shoeId} />;
}
