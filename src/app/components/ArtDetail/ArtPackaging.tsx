import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtPackagingProps {
  images: string[];
  packagingTitle?: string | null;
  packagingDescription?: string | null;
  title?: string;
}

export function ArtPackaging({
  images,
  packagingTitle,
  packagingDescription,
  title = '작품',
}: ArtPackagingProps) {
  if (images.length === 0 && !packagingTitle && !packagingDescription) return null;

  const imgClass = 'w-full h-full object-cover';
  const [first, second, third] = images;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-gray-400 mb-5">포장 사진</h2>

      <div className="grid grid-cols-2 gap-3">
        {/* 왼쪽: 이미지 그리드 */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {first && (
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <ImageWithFallback src={first} alt={`${title} 포장 1`} className={imgClass} />
              </div>
            )}
            {second && (
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <ImageWithFallback src={second} alt={`${title} 포장 2`} className={imgClass} />
              </div>
            )}
          </div>
          {third && (
            <div className="w-full aspect-[2/1] bg-gray-100 overflow-hidden">
              <ImageWithFallback src={third} alt={`${title} 포장 3`} className={imgClass} />
            </div>
          )}
        </div>

        {/* 오른쪽: 제목 + 설명 */}
        <div className="flex flex-col justify-start gap-2 pl-1">
          {packagingTitle && (
            <h3 className="text-base font-semibold text-gray-900">{packagingTitle}</h3>
          )}
          {packagingDescription && (
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
              {packagingDescription}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
