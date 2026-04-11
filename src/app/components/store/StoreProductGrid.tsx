import { useTranslation } from 'react-i18next';
import ProductCard from '@/app/components/products/ProductCard';

interface StoreProductGridProps {
  loading: boolean;
  skus: any[];
  viewMode: 'grid' | 'large';
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  wishlistedCodes: Set<string>;
  wishlistLoading: Set<string>;
  onWishlistClick: (e: React.MouseEvent, skuCode: string) => void;
}

export default function StoreProductGrid({
  loading,
  skus,
  viewMode,
  page,
  totalPages,
  onPageChange,
  wishlistedCodes,
  wishlistLoading,
  onWishlistClick,
}: StoreProductGridProps) {
  const { t } = useTranslation();

  return (
    <div className="px-4 pb-28">
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-xl mb-2" />
              <div className="h-3 bg-gray-100 rounded mb-1 w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : skus.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
          <h2 className="text-base mb-1 font-medium">{t('store.emptyState.title')}</h2>
          <p className="text-xs text-gray-400">{t('store.emptyState.description')}</p>
        </div>
      ) : (
        <>
          <div
            className={`grid ${
              viewMode === 'grid' ? 'grid-cols-2 gap-x-3 gap-y-6' : 'grid-cols-1 gap-y-6'
            }`}
          >
            {skus.map((sku) => (
              <ProductCard
                key={sku.skuCode}
                sku={sku}
                viewMode={viewMode}
                isWishlisted={wishlistedCodes.has(sku.skuCode)}
                isWishlistLoading={wishlistLoading.has(sku.skuCode)}
                onWishlistClick={onWishlistClick}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => onPageChange(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-5 py-2 rounded-full border border-gray-200 text-xs disabled:opacity-30 hover:border-black transition-colors"
              >
                {t('common.prev')}
              </button>
              <span className="px-5 py-2 text-xs text-gray-500">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="px-5 py-2 rounded-full border border-gray-200 text-xs disabled:opacity-30 hover:border-black transition-colors"
              >
                {t('common.next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
