import { Link } from 'react-router';
import { Shield, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ProductInfo({ sku }: { sku: any }) {
  const { t } = useTranslation();

  const formatPrice = (price?: number) => {
    if (!price) return t('product.detail.info.priceOnRequest');
    return `₩${price.toLocaleString()}`;
  };

  return (
    <>
      <div className="mb-5">
        <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-2">{sku.genre}</div>
        <h1 className="text-2xl font-medium tracking-tight mb-2 leading-tight">{sku.name}</h1>
        <Link
          to={`/artist/${sku.artistCode}`}
          className="text-base text-gray-500 hover:text-black transition-colors inline-block"
        >
          {t('product.detail.info.by')} {sku.artistName}
        </Link>
      </div>

      <div className="text-3xl font-bold mb-6 tracking-tight">
        {formatPrice(sku.salePrice ?? sku.listPrice)}
        {sku.salePrice && sku.salePrice < sku.listPrice && (
          <span className="text-base text-gray-400 line-through ml-3">{formatPrice(sku.listPrice)}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
          <Shield className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-medium text-gray-600">{t('product.detail.info.authentic')}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
          <Globe className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-medium text-gray-600">{t('product.detail.info.globalShipping')}</span>
        </div>
        {sku.isLimitedEdition && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
            <span className="text-xs font-medium text-gray-600">
              {t('product.detail.info.edition', { current: sku.editionNumber, total: sku.editionSize })}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 border-t border-gray-100 pt-5 mb-5">
        <p className="text-sm text-gray-600 leading-relaxed">{sku.description}</p>
        {(sku.widthCm || sku.weightKg) && (
          <div className="grid grid-cols-2 gap-y-3 pt-2">
            {sku.widthCm && (
              <>
                <span className="text-xs text-gray-400 font-medium">{t('product.detail.info.size')}</span>
                <span className="text-xs font-semibold">
                  {sku.widthCm}cm × {sku.heightCm}cm{sku.depthCm && ` × ${sku.depthCm}cm`}
                </span>
              </>
            )}
            {sku.weightKg && (
              <>
                <span className="text-xs text-gray-400 font-medium">{t('product.detail.info.weight')}</span>
                <span className="text-xs font-semibold">{sku.weightKg}kg</span>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
