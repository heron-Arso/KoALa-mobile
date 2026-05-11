import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import { getSku } from '@/api/sku';
import { getArtist } from '@/api/artist';
import { ProductSkeleton, ProductNotFound } from '@/app/components/products';
import {
  ArtDetailHeader,
  ArtImages,
  ArtArtist,
  ArtInfo,
  ArtQnA,
} from '@/app/components/ArtDetail';

export default function ArtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sku, setSku] = useState<any>(null);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const fetchData = async () => {
      setLoading(true);
      try {
        const skuRes = await getSku(id!);
        const skuData = skuRes.data.data;
        setSku(skuData);

        if (skuData.artistCode) {
          try {
            const artistRes = await getArtist(skuData.artistCode);
            setArtist(artistRes.data.data);
          } catch {
            // artist 없으면 이름만 표시
          }
        }
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <ProductSkeleton />;
  if (!sku) return <ProductNotFound />;

  const images =
    sku.mediaList && sku.mediaList.length > 0
      ? sku.mediaList.filter((m: any) => m.mediaType === 'IMAGE').map((m: any) => m.fileUrl)
      : sku.primaryImageUrl
      ? [sku.primaryImageUrl]
      : [];

  const artInfoItems = [
    { label: '소재', value: sku.genre ?? '-' },
    { label: '크기', value: sku.widthCm ? `${sku.widthCm}cm × ${sku.heightCm}cm` : '-' },
    { label: '무게', value: sku.weightKg ? `${sku.weightKg}kg` : '-' },
    { label: '배달비용', value: '-' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-400 active:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </button>

        <ArtDetailHeader
          breadcrumb="작품 소개"
          worldViewTitle={sku.name}
          worldViewDesc={sku.description ?? ''}
        />

        <ArtImages images={images} title={sku.name} />

        <ArtArtist
          artistCode={sku.artistCode}
          artistName={sku.artistName}
          artistDescription={artist?.bio}
          artistImageUrl={artist?.profileImageUrl}
        />

        <ArtInfo items={artInfoItems} />

        <ArtQnA />
      </main>
    </div>
  );
}
