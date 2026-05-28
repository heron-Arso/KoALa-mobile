import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtImagesProps {
  images?: string[];
  title?: string;
}

const PLACEHOLDER = 'https://via.placeholder.com/400x400';

export function ArtImages({ images, title = '작품' }: ArtImagesProps) {
  const imgs = images && images.length > 0 ? images : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-gray-400 mb-5">작품 - 상세</h2>
      <div className="grid grid-cols-2 gap-2">
        {imgs.slice(0, 4).map((src, idx) => (
          <div key={idx} className="aspect-square bg-gray-100 overflow-hidden">
            <ImageWithFallback
              src={src}
              alt={`${title} ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
