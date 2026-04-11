import { Link } from 'react-router';
import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EmptyCart() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
      <ShoppingBag className="w-14 h-14 mx-auto text-gray-200 mb-4" />
      <h2 className="text-xl font-medium mb-2">{t('cart.emptyState.title')}</h2>
      <p className="text-sm text-gray-400 mb-8 px-6">{t('cart.emptyState.description')}</p>
      <Link
        to="/smart-store"
        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
      >
        {t('cart.emptyState.continueShopping')}
      </Link>
    </div>
  );
}
