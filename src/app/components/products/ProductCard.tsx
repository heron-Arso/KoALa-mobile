import { Heart } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ProductCardProps {
  sku: any;
  viewMode: 'grid' | 'large';
  isWishlisted: boolean;
  isWishlistLoading: boolean;
  onWishlistClick: (e: React.MouseEvent, skuCode: string) => void;
}

export default function ProductCard({
  sku,
  viewMode,
  isWishlisted,
  isWishlistLoading,
  onWishlistClick,
}: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <Link to={`/product/${sku.skuCode}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-gray-100">
        <div className={`relative w-full ${viewMode === 'grid' ? 'aspect-square' : 'aspect-[4/3]'}`}>
          <ImageWithFallback
            src={sku.primaryImageUrl ?? '/placeholder.svg'}
            alt={sku.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <div className="px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[9px] font-bold tracking-tight uppercase shadow-sm">
              {t(`store.categories.${sku.genre}`, { defaultValue: sku.genre })}
            </div>
            {sku.isLimitedEdition && (
              <div className="w-fit px-2 py-1 rounded-md bg-koala-red text-white text-[9px] font-bold uppercase shadow-sm">
                {t('store.product.limited')}
              </div>
            )}
          </div>

          <div className="absolute top-2 right-2">
            <div
              className={`px-2 py-1 rounded-md text-[9px] font-bold backdrop-blur-sm shadow-sm ${
                sku.status === 'ACTIVE'
                  ? 'bg-green-500/90 text-white'
                  : sku.status === 'OUT_OF_STOCK'
                  ? 'bg-gray-900/90 text-white'
                  : 'bg-blue-500/90 text-white'
              }`}
            >
              {sku.status === 'ACTIVE'
                ? t('store.product.status.available')
                : sku.status === 'OUT_OF_STOCK'
                ? t('store.product.status.soldOut')
                : sku.status}
            </div>
          </div>

          <button
            onClick={(e) => onWishlistClick(e, sku.skuCode)}
            disabled={isWishlistLoading}
            className={`absolute bottom-2 right-2 p-2 rounded-full backdrop-blur-sm shadow-sm transition-all duration-200 ${
              isWishlisted
                ? 'bg-koala-red text-white'
                : 'bg-white/90 text-gray-500 hover:bg-white hover:text-koala-red'
            } ${isWishlistLoading ? 'opacity-60 cursor-wait' : ''}`}
          >
            <Heart className="w-3.5 h-3.5" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="mt-2.5 px-0.5">
        <div className="text-[9px] text-gray-400 tracking-wider uppercase mb-1 font-medium">
          {t(`store.categories.${sku.genre}`, { defaultValue: sku.genre })}
        </div>
        <h3 className="text-sm font-bold mb-0.5 group-hover:text-gray-600 transition-colors truncate">
          {sku.name}
        </h3>
        <p className="text-xs text-gray-500 mb-1 font-medium">{sku.artistName}</p>
        <p className="text-sm font-black tracking-tight">
          ₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
