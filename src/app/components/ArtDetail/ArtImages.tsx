import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtImagesProps {
  images?: string[];
  title?: string;
}

export function ArtImages({ images, title = '작품' }: ArtImagesProps) {
  // 등록된 상세 사진이 없으면 섹션 자체를 숨긴다 (플레이스홀더 노출 X)
  if (!images || images.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-gray-400 mb-5">작품 - 상세</h2>

      {/* 한 장씩 풀폭으로, 작품이 잘리지 않게 자연 비율(h-auto)로 노출 */}
      <div className="flex flex-col gap-3">
        {images.map((src, idx) => (
          <div key={idx} className="w-full overflow-hidden rounded-lg bg-gray-50">
            <ImageWithFallback
              src={src}
              alt={`${title} 상세 ${idx + 1}`}
              className="w-full h-auto block"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
