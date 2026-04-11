import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export function ProductNotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 pb-24">
      <h1 className="text-2xl mb-6 font-medium">{t('product.detail.notFound.title')}</h1>
      <Link
        to="/smart-store"
        className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium"
      >
        {t('product.detail.notFound.backToStore')}
      </Link>
    </div>
  );
}
