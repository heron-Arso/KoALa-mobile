import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getArtists } from '@/api/artist';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import type { Artist, PageResponse } from '@/api/types';

interface TrendingArtistsProps {
  excludeArtistCode?: string;
}

export default function TrendingArtists({ excludeArtistCode }: TrendingArtistsProps) {
  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ['artists', 'trending'],
    queryFn: async () => {
      const res = await getArtists(0, 20);
      const page: PageResponse<Artist> = res.data.data;
      return page.content ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const filtered = artists.filter(
    (a) => !excludeArtistCode || a.artistCode !== excludeArtistCode
  );

  if (filtered.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-100 pt-10 px-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-gray-400">→</span> Trending Artists
        </h2>
        <Link
          to="/artist-lab"
          className="flex items-center gap-1 text-xs text-gray-400"
        >
          View All Artists
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 가로 스크롤 카드 목록 */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {filtered.map((artist) => (
          <Link
            key={artist.artistCode}
            to={`/artist/${artist.artistCode}`}
            className="flex-shrink-0 w-28"
          >
            <div className="w-28 h-32 rounded-2xl overflow-hidden bg-gray-100 mb-2">
              <ImageWithFallback
                src={artist.profileImageUrl ?? ''}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs font-semibold text-gray-900 truncate">{artist.name}</p>
            {artist.specialty && (
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{artist.specialty}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
