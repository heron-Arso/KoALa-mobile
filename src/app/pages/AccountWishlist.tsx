import { Link, useNavigate } from 'react-router';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMyProfile } from '../../api/user';
import { getWishlist, removeWishlist } from '../../api/wishlist';
import { addCartItem } from '../../api/cart';
import { useDialog } from '../../mobile/hooks/useDialog';

export default function AccountWishlist() {
    const navigate = useNavigate();
    const { alert } = useDialog();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [, wishlistRes] = await Promise.all([
                    getMyProfile(),
                    getWishlist(page, 12),
                ]);
                setWishlist(wishlistRes.data.data.content ?? []);
                setTotalPages(wishlistRes.data.data.totalPages ?? 0);
            } catch {
                navigate('/login');
                return;
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [page]);

    const handleRemove = async (skuCode: string) => {
        try {
            await removeWishlist(skuCode);
            setWishlist((prev) => prev.filter((item) => item.skuCode !== skuCode));
        } catch (e) {
            console.error('위시리스트 삭제 실패:', e);
        }
    };

    const handleAddToCart = async (skuCode: string) => {
        try {
            await addCartItem(skuCode, 1);
            window.dispatchEvent(new Event('cart-updated'));
            await alert('장바구니에 담겼습니다.');
        } catch (e: any) {
            await alert(e.response?.data?.message || '장바구니 담기 실패');
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="pt-8 pb-16 px-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight mb-1">찜 목록</h1>
                    <p className="text-xs text-gray-400">총 {wishlist.length}개의 찜한 상품</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-4 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i}>
                                <div className="aspect-square bg-gray-100 rounded-2xl mb-3" />
                                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 shadow-sm border border-dashed border-gray-200 text-center">
                        <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold mb-2">찜한 상품이 없습니다</h3>
                        <p className="text-sm text-gray-400 mb-6">마음에 드는 작품을 위시리스트에 추가해보세요.</p>
                        <Link
                            to="/store"
                            className="inline-block px-8 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all font-bold text-sm"
                        >
                            스토어 구경하기
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            {wishlist.map((item: any) => (
                                <div key={item.skuCode} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                    <Link to={`/product/${item.skuCode}`}>
                                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                                            <img
                                                src={item.primaryImageUrl ?? 'https://via.placeholder.com/400'}
                                                alt={item.skuName}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {item.isLimitedEdition && (
                                                <div className="absolute top-2 left-2">
                                                    <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded-lg">Limited</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="p-3">
                                        <Link to={`/product/${item.skuCode}`}>
                                            <h3 className="text-xs font-bold mb-1 truncate">{item.skuName}</h3>
                                        </Link>
                                        <p className="text-sm font-black mb-3">₩{(item.salePrice ?? item.listPrice).toLocaleString()}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddToCart(item.skuCode)}
                                                className="flex-1 flex items-center justify-center gap-1 py-2 bg-black text-white rounded-xl text-xs font-bold"
                                            >
                                                <ShoppingCart className="w-3 h-3" /> 담기
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.skuCode)}
                                                className="p-2 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3 text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-5 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30">이전</button>
                                <span className="px-5 py-2 text-sm text-gray-500">{page + 1} / {totalPages}</span>
                                <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="px-5 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30">다음</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
