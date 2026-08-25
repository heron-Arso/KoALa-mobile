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
    { path: '/smart-store',      icon: Search,        label: '탐색' },
    { path: '/account/wishlist', icon: Heart,         label: '위시리스트' },
    { path: '/',                 icon: Home,          label: '홈' },      // 중앙(원형)
    { path: '/cart',             icon: ShoppingCart,  label: '장바구니' },
    { path: '/account',          icon: User,          label: '계정' },
];

// 가운데에 원형으로 띄울 탭의 인덱스
const CENTER_INDEX = 2;

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
                {tabs.map(({ path: tabPath, icon: Icon, label }, idx) => {
                    const active = isTabActive(tabPath, path);

                    // ── 중앙 홈: 원형으로 띄우는(floating) 버튼 ──
                    if (idx === CENTER_INDEX) {
                        return (
                            <button
                                key={tabPath}
                                onClick={() => navigate(tabPath)}
                                className="flex flex-col items-center flex-1"
                            >
                                <div
                                    className={`-mt-8 mb-1 flex items-center justify-center w-14 h-14 rounded-full ring-4 ring-white shadow-lg transition-colors ${active ? 'bg-koala-navy' : 'bg-gray-800'}`}
                                >
                                    <Icon className="w-6 h-6 text-white" strokeWidth={2.2} />
                                </div>
                                <span className={`text-[10px] transition-colors ${active ? 'text-black font-semibold' : 'text-gray-500'}`}>
                                    {label}
                                </span>
                            </button>
                        );
                    }

                    // ── 일반 탭 ──
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
                                    <span className="absolute -top-1 -right-1.5 bg-koala-navy text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
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
