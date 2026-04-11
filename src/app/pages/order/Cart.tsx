import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCart, updateCartItem, removeCartItem, clearCart } from '@/api/cart';
import { useDialog } from '@/mobile/hooks/useDialog';
import CartItem from '@/app/components/Cart/CartItem';
import CartSkeleton from '@/app/components/Cart/CartSkeleton';
import EmptyCart from '@/app/components/Cart/EmptyCart';
import OrderSummary from '@/app/components/Cart/OrderSummary';

export default function Cart() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { confirm } = useDialog();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.data);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleUpdateQuantity = async (itemId: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) { handleRemoveItem(itemId); return; }
    try {
      const res = await updateCartItem(itemId, newQty);
      setCart(res.data.data);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) { console.error('수량 변경 실패:', e); }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!await confirm(t('cart.alerts.removeConfirm'))) return;
    try {
      const res = await removeCartItem(itemId);
      setCart(res.data.data);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) { console.error('삭제 실패:', e); }
  };

  const handleClearCart = async () => {
    if (!await confirm(t('cart.alerts.clearConfirm'))) return;
    try {
      await clearCart();
      setCart(null);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) { console.error('장바구니 비우기 실패:', e); }
  };

  const cartItems = cart?.items ?? [];
  const subtotal = cart?.subtotalAmount ?? 0;
  const shipping = cartItems.length > 0 ? (subtotal >= 50000 ? 0 : 3000) : 0;
  const total = subtotal + shipping;

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 pt-4 pb-28">
      <div className="h-7 bg-gray-100 rounded w-1/3 mb-1 animate-pulse" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-6 animate-pulse" />
      <CartSkeleton />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28">
      <div className="px-4 pt-4">
        <div className="mb-5">
          <h1 className="text-2xl font-medium tracking-tight mb-1">{t('cart.title')}</h1>
          <p className="text-xs text-gray-400">
            {cartItems.length === 0
              ? t('cart.emptyMessage')
              : t('cart.itemCount', { count: cartItems.length })}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {cartItems.map((item: any) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            <div className="flex items-center justify-between py-2">
              <Link to="/smart-store" className="text-xs text-gray-400 hover:text-black transition-colors">
                ← {t('cart.emptyState.continueShopping')}
              </Link>
              <button
                onClick={handleClearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                {t('cart.clearAll')}
              </button>
            </div>

            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </div>
        )}
      </div>
    </div>
  );
}
