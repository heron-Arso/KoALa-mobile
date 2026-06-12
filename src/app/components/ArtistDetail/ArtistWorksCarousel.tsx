import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

export interface WorkItem {
  id: string;
  title: string;
  imageUrl: string;
  price?: number;
}

interface ArtistWorksCarouselProps {
  works?: WorkItem[];
  artistId?: string;
}

const PLACEHOLDER_WORKS: WorkItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  title: `작품 ${i + 1}`,
  imageUrl: '/placeholder.svg',
}));

export function ArtistWorksCarousel({ works = PLACEHOLDER_WORKS, artistId }: ArtistWorksCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const allWorksUrl = artistId ? `/artist/${artistId}/works` : '#';

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">작가의 작품 - Works</h3>
        <Link
          to={allWorksUrl}
          className="flex items-center gap-1 text-sm text-gray-400 active:text-black transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="text-xs">전체보기</span>
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {works.map((work) => (
          <Link
            key={work.id}
            to={`/product/${work.id}`}
            className="flex-shrink-0 w-44 active:opacity-70"
          >
            <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden mb-2">
              <ImageWithFallback
                src={work.imageUrl}
                alt={work.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium truncate">{work.title}</p>
            {work.price != null && (
              <p className="text-sm text-gray-400">{work.price.toLocaleString()}원</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
