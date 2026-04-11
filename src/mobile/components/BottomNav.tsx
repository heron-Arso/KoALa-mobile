import { useLocation, useNavigate } from 'react-router';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCart } from '@/api/cart';

// 바텀 네비게이션을 숨길 라우트
const HIDDEN_ROUTES = [
    '/onboarding',
    '/forgot-password',
    '/oauth2/callback',
    '/checkout',
    '/checkout/confirm',
    '/checkout/success',
    '/payment/success',
    '/payment/fail',
];

const tabs = [
    { path: '/',                icon: Home,          label: '홈' },
    { path: '/smart-store',     icon: Search,         label: '탐색' },
    { path: '/cart',            icon: ShoppingCart,   label: '장바구니' },
    { path: '/account/wishlist',icon: Heart,          label: '위시리스트' },
    { path: '/account',         icon: User,           label: '계정' },
];

function isTabActive(tabPath: string, currentPath: string): boolean {
    if (tabPath === '/') return currentPath === '/';
    if (tabPath === '/account') {
        // /account/wishlist는 별도 탭이므로 제외
        return currentPath === '/account' ||
            (currentPath.startsWith('/account/') && !currentPath.startsWith('/account/wishlist'));
    }
    return currentPath === tabPath || currentPath.startsWith(tabPath + '/');
}

export default function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const path = location.pathname;

    // 풀스크린 페이지도 숨김
    const hidden =
        HIDDEN_ROUTES.some(r => path === r || path.startsWith(r + '/')) ||
        path.endsWith('/360') ||
        path === '/ar-view';

    useEffect(() => {
        const fetchCount = () => {
            getCart()
                .then((res: any) => {
                    const items = res.data?.data?.items ?? [];
                    const total = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
                    setCartCount(total);
                })
                .catch(() => setCartCount(0));
        };
        fetchCount();
        window.addEventListener('cart-updated', fetchCount);
        return () => window.removeEventListener('cart-updated', fetchCount);
    }, []);

    if (hidden) return null;

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className="flex items-center justify-around h-16">
                {tabs.map(({ path: tabPath, icon: Icon, label }) => {
                    const active = isTabActive(tabPath, path);
                    return (
                        <button
                            key={tabPath}
                            onClick={() => navigate(tabPath)}
                            className="flex flex-col items-center gap-1 flex-1 py-2"
                        >
                            <div className="relative">
                                <Icon
                                    className={`w-6 h-6 transition-colors ${active ? 'text-black' : 'text-gray-400'}`}
                                    strokeWidth={active ? 2.5 : 1.8}
                                />
                                {tabPath === '/cart' && cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1.5 bg-black text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] transition-colors ${active ? 'text-black font-semibold' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
