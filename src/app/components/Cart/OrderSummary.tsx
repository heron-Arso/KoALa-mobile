import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

interface OrderSummaryProps {
  cartItems: any[];
  subtotal: number;
  shipping: number;
  total: number;
}

export default function OrderSummary({ cartItems, subtotal, shipping, total }: OrderSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold mb-4">{t('cart.summary.title')}</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{t('cart.summary.subtotal')}</span>
          <span className="font-medium">₩{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{t('cart.summary.shipping')}</span>
          <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
            {shipping === 0 ? t('cart.summary.freeShipping') : `₩${shipping.toLocaleString()}`}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-gray-400">{t('cart.summary.shippingNotice')}</p>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4 mb-5">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm">{t('cart.summary.total')}</span>
          <span className="text-xl font-bold">₩{total.toLocaleString()}</span>
        </div>
        <p className="text-[10px] text-gray-400 text-right mt-0.5">{t('cart.summary.vatIncluded')}</p>
      </div>

      <Link
        to="/checkout"
        state={{ cartItems, subtotal, shipping, total }}
        className="block w-full py-4 bg-koala-navy text-white text-center rounded-2xl hover:bg-koala-navy-hover transition-colors font-medium text-sm"
      >
        {t('cart.summary.checkout')}
      </Link>

      <p className="text-[10px] text-gray-400 text-center mt-3">
        {t('cart.summary.securePayment')}
      </p>
    </div>
  );
}
