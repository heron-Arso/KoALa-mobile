import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut, Camera, CheckCircle2, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { getSku } from '@/api/sku';
import { addCartItem } from '@/api/cart';
import { useDialog } from '@/mobile/hooks/useDialog';

export default function ARView() {
  const navigate = useNavigate();
  const { alert } = useDialog();
  const [searchParams] = useSearchParams();
  const skuCode = searchParams.get('skuCode');

  const [mode, setMode] = useState<'360' | 'ar'>('360');
  const [sku, setSku] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!skuCode) return;
    const fetchSku = async () => {
      setLoading(true);
      try {
        const res = await getSku(skuCode);
        setSku(res.data.data);
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSku();
  }, [skuCode]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToCart = async () => {
    if (!sku) return;
    setCartLoading(true);
    try {
      await addCartItem(sku.skuCode, 1);
      window.dispatchEvent(new Event('cart-updated'));
      showToastMessage('장바구니에 담겼습니다.');
    } catch (e: any) {
      await alert(e.response?.data?.message || '장바구니 담기 실패');
    } finally {
      setCartLoading(false);
    }
  };

  const handleARMode = () => {
    setMode('ar');
    showToastMessage('AR 기능은 준비 중입니다.');
    setTimeout(() => setMode('360'), 1500);
  };

  const displayImage = sku?.primaryImageUrl
    ?? sku?.spinePicturesJson?.[0]
    ?? 'https://via.placeholder.com/400';

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* 상단 바 */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold">{sku?.name ?? 'AR 뷰어'}</span>
        <div className="w-9" />
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-sm">
          <div className="bg-black text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm font-semibold flex-1">{toastMessage}</p>
            <button onClick={() => setShowToast(false)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
        </div>
      )}

      {/* 뷰어 영역 */}
      <div className="pt-16 pb-32 h-screen flex flex-col">
        {/* 모드 토글 */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-gray-100">
            <button
              onClick={() => setMode('360')}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${mode === '360' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
            >
              360° 뷰어
            </button>
            <button
              onClick={handleARMode}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${mode === 'ar' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
            >
              AR 공간 배치
            </button>
          </div>
        </div>

        {/* 이미지 */}
        <div className="flex-1 relative flex items-center justify-center px-4 bg-gray-50 mx-4 rounded-3xl overflow-hidden">
          {mode === 'ar' ? (
            <div className="text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-base font-bold text-gray-700 mb-1">AR 기능 준비 중</p>
              <p className="text-xs text-gray-400">WebXR 기반 AR이 곧 추가됩니다.</p>
            </div>
          ) : loading ? (
            <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}>
              <ImageWithFallback
                src={displayImage}
                alt={sku?.name ?? '상품 이미지'}
                className="w-full max-w-xs aspect-square object-contain drop-shadow-xl"
              />
            </div>
          )}

          {/* 줌 컨트롤 */}
          <div className="absolute right-4 bottom-4 flex flex-col gap-2">
            <button onClick={() => setZoom((p) => Math.min(p + 0.25, 3))} className="p-3 bg-white rounded-xl shadow-md"><ZoomIn className="w-4 h-4" /></button>
            <button onClick={() => setZoom(1)} className="p-3 bg-white rounded-xl shadow-md"><RotateCcw className="w-4 h-4" /></button>
            <button onClick={() => setZoom((p) => Math.max(p - 0.25, 0.5))} className="p-3 bg-white rounded-xl shadow-md"><ZoomOut className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* 하단 구매 바 */}
      {sku && (
        <div className="fixed bottom-16 left-0 right-0 px-4 pb-4 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-40">
          <div className="flex items-center gap-4 pt-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Price</p>
              <p className="text-lg font-black">₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}</p>
            </div>
            <Link to={`/product/${sku.skuCode}`} className="flex-1 py-3 border border-gray-200 text-black text-center rounded-xl text-sm font-bold">상세 보기</Link>
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || sku.status === 'OUT_OF_STOCK'}
              className="flex-1 py-3 bg-black text-white rounded-xl font-bold text-sm disabled:opacity-50"
            >
              {sku.status === 'OUT_OF_STOCK' ? '품절' : cartLoading ? '담는 중...' : '담기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
