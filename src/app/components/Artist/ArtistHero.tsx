import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Bell, BellOff } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { useTranslation } from 'react-i18next';
import { followArtist, unfollowArtist } from '@/api/artist';
import { ShareButton } from '@/app/components/common/ShareButton';

interface ArtistHeroProps {
  artist: any;
  isFollowing: boolean;
}

export function ArtistHero({ artist, isFollowing: initialFollowing }: ArtistHeroProps) {
  const navigate = useNavigate();
  const { t } = useTranslation('artistLab');

  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(artist.followCount ?? 0);
  const [loading, setLoading] = useState(false);

  // 새로고침 후 서버에서 받은 최신값 반영
  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowArtist(artist.artistCode);
        setIsFollowing(false);
        setCount((c: number) => Math.max(0, c - 1));
      } else {
        await followArtist(artist.artistCode);
        setIsFollowing(true);
        setCount((c: number) => c + 1);
      }
    } catch (e: any) {
      if (e?.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 py-2 text-sm text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t('detail.back')}</span>
        </button>
        <ShareButton
          title={`${artist.name} — KoALa 작가`}
          description={artist.description}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 mb-20 md:mb-32">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gray-50 aspect-[3/4] shadow-xl">
          <ImageWithFallback
            src={artist.profileImageUrl ?? ''}
            alt={artist.name}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-8 md:mb-10">
            <div className="text-[10px] md:text-xs text-gray-400 tracking-[0.3em] uppercase mb-4 font-bold">
              {t('detail.labels.artist')}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tighter leading-none">
              {artist.name}
            </h1>
            <p className="text-base md:text-xl text-gray-600 leading-relaxed break-keep">
              {artist.description ?? t('detail.emptyDescription')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/smart-store"
              className="flex-1 py-4 md:py-5 bg-koala-navy text-white rounded-full font-bold text-sm md:text-base hover:bg-koala-navy-hover transition-all active:scale-95 text-center"
            >
              {t('detail.viewWorks')}
            </Link>

            {/* 팔로우 버튼 */}
            <button
              onClick={handleFollow}
              disabled={loading}
              className={`flex items-center justify-center gap-2 px-6 py-4 md:py-5 rounded-full font-bold text-sm md:text-base transition-all active:scale-95 disabled:opacity-50 ${
                isFollowing
                  ? 'bg-koala-navy text-white'
                  : 'border border-gray-200 text-gray-700 hover:border-black hover:text-black'
              }`}
            >
              {isFollowing
                ? <BellOff className="w-4 h-4" />
                : <Bell className="w-4 h-4" />}
              <span>{isFollowing ? '팔로잉' : '팔로우'}</span>
              {count > 0 && (
                <span className={`text-xs ${isFollowing ? 'text-white/70' : 'text-gray-400'}`}>
                  {count.toLocaleString()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
