import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import { ShareButton } from '@/app/components/common/ShareButton';
import { getSku } from '@/api/sku';
import { getArtist } from '@/api/artist';
import { ProductSkeleton, ProductNotFound } from '@/app/components/products';
import {
  ArtDetailHeader,
  ArtImages,
  ArtMaterial,
  ArtPackaging,
  ArtArtist,
  ArtInfo,
  ArtQnA,
} from '@/app/components/ArtDetail';

const GENRE_LABELS: Record<string, string> = {
  ART_TOY:      '아트 토이',
  SCULPTURE:    '조각',
  PAINTING:     '페인팅',
  PRINT:        '판화 / 프린트',
  PHOTOGRAPH:   '사진',
  INSTALLATION: '설치 미술',
  TEXTILE:      '섬유 / 직물',
  OTHER:        '기타',
};

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

  // 작품 상세 이미지(DETAIL)
  const detailImgs = sku.mediaList
    ?.filter((m: any) => m.mediaRole === 'DETAIL')
    .map((m: any) => m.fileUrl) ?? [];

  // 재질 이미지(MATERIAL)
  const materialImgs = sku.mediaList
    ?.filter((m: any) => m.mediaRole === 'MATERIAL')
    .map((m: any) => m.fileUrl) ?? [];

  // 포장 이미지(PACKAGING)
  const packagingImgs = sku.mediaList
    ?.filter((m: any) => m.mediaRole === 'PACKAGING')
    .map((m: any) => m.fileUrl) ?? [];

  const artInfoItems = [
    { label: '아트 종류', value: GENRE_LABELS[sku.genre as string] ?? sku.genre ?? '-' },
    { label: '소재',     value: sku.material || '-' },
    { label: '크기',     value: sku.widthCm ? `${sku.widthCm}cm × ${sku.heightCm}cm` : '-' },
    { label: '무게',     value: sku.weightKg ? `${sku.weightKg}kg` : '-' },
    { label: '배달비용', value: '-' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto w-full">
        {/* 뒤로가기 + 공유 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 active:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </button>
          <ShareButton
            title={sku.name}
            description={sku.description ?? undefined}
          />
        </div>

        {/* 1. 작품 헤더 */}
        <ArtDetailHeader
          breadcrumb="작품 소개"
          worldViewTitle={sku.name}
          worldViewDesc={sku.description ?? ''}
        />

        {/* 2. 작품 상세 이미지 */}
        <ArtImages images={detailImgs} title={sku.name} />

        {/* 3. 재질 / 소재 사진 + 설명 */}
        <ArtMaterial
          images={materialImgs}
          description={sku.materialDescription}
          title={sku.name}
        />

        {/* 4. 포장 사진 */}
        <ArtPackaging
          images={packagingImgs}
          packagingTitle={sku.packagingTitle}
          packagingDescription={sku.packagingDescription}
          title={sku.name}
        />

        {/* 5. 아티스트 */}
        <ArtArtist
          artistCode={sku.artistCode}
          artistName={sku.artistName}
          artistDescription={artist?.bio}
          artistImageUrl={artist?.profileImageUrl}
        />

        {/* 6. 작품 스펙 테이블 */}
        <ArtInfo items={artInfoItems} />

        {/* 7. Q&A */}
        <ArtQnA />
      </main>
    </div>
  );
}
