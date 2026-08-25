import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, X, CheckCircle2, ShoppingCart, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { getSku } from '@/api/sku';
import { addCartItem } from '@/api/cart';
import { useDialog } from '@/mobile/hooks/useDialog';

/* ── 드래그/핀치 상태 ── */
interface Pos { x: number; y: number }
interface ArtworkTransform { x: number; y: number; scale: number }

function getMidpoint(t0: Touch, t1: Touch): Pos {
  return { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 };
}
function getDist(t0: Touch, t1: Touch) {
  return Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
}

/* ── 그림자 깊이 계산 (화면 아래일수록 더 짙고 퍼짐) ── */
function shadowStyle(y: number, screenH: number, scale: number) {
  const depth = Math.max(0, Math.min(1, y / screenH));
  const blur = 8 + depth * 32;
  const spread = -2 + depth * 10;
  const opacity = 0.15 + depth * 0.4;
  return `0 ${4 + depth * 20}px ${blur}px ${spread}px rgba(0,0,0,${opacity.toFixed(2)})`;
}

export default function ARView() {
  const navigate = useNavigate();
  const { alert } = useDialog();
  const [searchParams] = useSearchParams();
  const skuCode = searchParams.get('skuCode');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [sku, setSku] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* 작품 위치/크기 */
  const [transform, setTransform] = useState<ArtworkTransform>({ x: 0, y: 0, scale: 1 });

  /* 터치 상태 refs (re-render 없이 관리) */
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; initTx: number; initTy: number }>({
    active: false, startX: 0, startY: 0, initTx: 0, initTy: 0,
  });
  const pinchRef = useRef<{ active: boolean; initDist: number; initScale: number }>({
    active: false, initDist: 0, initScale: 1,
  });

  /* ── SKU 로드 ── */
  useEffect(() => {
    if (!skuCode) return;
    setLoading(true);
    getSku(skuCode)
      .then(res => setSku(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [skuCode]);

  /* ── 카메라 시작 ── */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().then(() => { if (mounted) setCameraReady(true); });
        }
      } catch (e: any) {
        if (!mounted) return;
        if (e.name === 'NotAllowedError') setCameraError('카메라 권한이 필요합니다.\n설정에서 카메라 접근을 허용해주세요.');
        else setCameraError('카메라를 시작할 수 없습니다.');
      }
    })();
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  /* ── 초기 위치: 화면 중앙 ── */
  useEffect(() => {
    if (cameraReady && containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTransform({ x: width / 2, y: height * 0.6, scale: 1 });
    }
  }, [cameraReady]);

  /* ── 토스트 ── */
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  /* ── 장바구니 ── */
  const handleAddToCart = async () => {
    if (!sku) return;
    setCartLoading(true);
    try {
      await addCartItem(sku.skuCode, 1);
      window.dispatchEvent(new Event('cart-updated'));
      showToast('장바구니에 담겼습니다.');
    } catch (e: any) {
      await alert(e.response?.data?.message || '장바구니 담기 실패');
    } finally {
      setCartLoading(false);
    }
  };

  /* ── 터치 핸들러 ── */
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length === 1) {
      const t = e.touches[0];
      dragRef.current = { active: true, startX: t.clientX, startY: t.clientY, initTx: transform.x, initTy: transform.y };
      pinchRef.current.active = false;
    } else if (e.touches.length === 2) {
      dragRef.current.active = false;
      pinchRef.current = { active: true, initDist: getDist(e.touches[0], e.touches[1]), initScale: transform.scale };
    }
  }, [transform]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length === 1 && dragRef.current.active) {
      const t = e.touches[0];
      const dx = t.clientX - dragRef.current.startX;
      const dy = t.clientY - dragRef.current.startY;
      setTransform(prev => ({ ...prev, x: dragRef.current.initTx + dx, y: dragRef.current.initTy + dy }));
    } else if (e.touches.length === 2 && pinchRef.current.active) {
      const dist = getDist(e.touches[0], e.touches[1]);
      const ratio = dist / pinchRef.current.initDist;
      const newScale = Math.max(0.3, Math.min(3.5, pinchRef.current.initScale * ratio));
      /* 핀치 중심점으로 위치도 보정 */
      const mid = getMidpoint(e.touches[0], e.touches[1]);
      setTransform(prev => {
        const scaleDiff = newScale - prev.scale;
        return {
          x: prev.x - (mid.x - prev.x) * (scaleDiff / prev.scale) * 0.15,
          y: prev.y - (mid.y - prev.y) * (scaleDiff / prev.scale) * 0.15,
          scale: newScale,
        };
      });
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    dragRef.current.active = false;
    pinchRef.current.active = false;
  }, []);

  const resetTransform = () => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTransform({ x: width / 2, y: height * 0.6, scale: 1 });
    }
  };

  const displayImage = sku?.primaryImageUrl ?? sku?.spinePicturesJson?.[0];
  const screenH = containerRef.current?.getBoundingClientRect().height ?? window.innerHeight;

  return (
    <div className="fixed inset-0 bg-koala-navy overflow-hidden select-none">

      {/* ── 카메라 배경 ── */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: cameraReady ? 1 : 0, transition: 'opacity 0.6s ease' }}
      />

      {/* ── 카메라 미시작 상태 ── */}
      {!cameraReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          {cameraError ? (
            <div className="text-center px-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <X className="w-8 h-8 text-white/60" />
              </div>
              <p className="text-white text-sm leading-relaxed whitespace-pre-line">{cameraError}</p>
            </div>
          ) : (
            <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* ── 스캔 프레임 오버레이 (가이드) ── */}
      {cameraReady && (
        <div className="absolute inset-0 pointer-events-none">
          {/* 모서리 가이드 */}
          {[
            'top-12 left-8',
            'top-12 right-8 rotate-90',
            'bottom-36 left-8 -rotate-90',
            'bottom-36 right-8 rotate-180',
          ].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8`}>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-white/50" />
              <div className="absolute top-0 left-0 h-full w-0.5 bg-white/50" />
            </div>
          ))}
        </div>
      )}

      {/* ── 작품 이미지 (드래그/핀치 가능) ── */}
      {cameraReady && displayImage && (
        <div
          className="absolute touch-none"
          style={{
            left: transform.x,
            top: transform.y,
            transform: `translate(-50%, -50%) scale(${transform.scale})`,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* 바닥 그림자 */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/30"
            style={{
              width: `${60 + Math.max(0, (transform.y / screenH) * 80)}%`,
              height: `${8 + (transform.y / screenH) * 20}px`,
              filter: `blur(${4 + (transform.y / screenH) * 12}px)`,
              transform: `translateX(-50%) scaleX(${0.8 + (transform.y / screenH) * 0.4})`,
            }}
          />

          {/* 액자 + 이미지 */}
          <div
            className="relative bg-white"
            style={{
              width: 180,
              padding: 8,
              boxShadow: shadowStyle(transform.y, screenH, transform.scale),
              /* 위치에 따라 미세한 원근 틸트 */
              transform: `perspective(600px) rotateX(${Math.max(-8, Math.min(8, (transform.y / screenH - 0.5) * 16))}deg)`,
            }}
          >
            <img
              src={displayImage}
              alt={sku?.name}
              className="w-full aspect-[4/5] object-cover block"
              draggable={false}
            />
            {/* 액자 하이라이트 */}
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)' }} />
          </div>

          {/* 드래그 힌트 링 */}
          <div className="absolute -inset-3 rounded-lg border-2 border-white/20 pointer-events-none" />
        </div>
      )}

      {/* ── 상단 바 ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-safe-top pb-3 pt-12">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="text-white text-xs font-medium tracking-wide">
            {loading ? '로딩 중...' : (sku?.name ?? 'AR 배치')}
          </span>
        </div>

        <button
          onClick={resetTransform}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* ── 조작 힌트 ── */}
      {cameraReady && displayImage && (
        <div className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-3"
          style={{ bottom: sku ? 120 : 48 }}>
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3">
            <span className="text-white/70 text-[10px] tracking-widest">드래그 이동</span>
            <div className="w-px h-3 bg-white/20" />
            <span className="text-white/70 text-[10px] tracking-widest">핀치 크기조절</span>
          </div>
        </div>
      )}

      {/* ── 하단 크기 조절 버튼 ── */}
      {cameraReady && displayImage && (
        <div className="absolute right-4 z-20 flex flex-col gap-2" style={{ bottom: sku ? 140 : 68 }}>
          <button
            onTouchStart={() => setTransform(p => ({ ...p, scale: Math.min(3.5, p.scale + 0.15) }))}
            className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:bg-white/20"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
          <button
            onTouchStart={() => setTransform(p => ({ ...p, scale: Math.max(0.3, p.scale - 0.15) }))}
            className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:bg-white/20"
          >
            <Minimize2 className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* ── 하단 상품 바 ── */}
      {sku && (
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <div className="mx-4 mb-4 bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 p-4">
              {displayImage && (
                <img src={displayImage} alt={sku.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium truncate">{sku.artistName}</p>
                <p className="text-sm font-bold truncate">{sku.name}</p>
                <p className="text-base font-black">₩{(sku.salePrice ?? sku.listPrice)?.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link
                  to={`/product/${sku.skuCode}`}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-center"
                >
                  상세 보기
                </Link>
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || sku.status === 'OUT_OF_STOCK'}
                  className="px-4 py-2 bg-koala-navy text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {sku.status === 'OUT_OF_STOCK' ? '품절' : cartLoading ? '...' : '담기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 토스트 ── */}
      {toast && (
        <div className="absolute left-1/2 -translate-x-1/2 z-50 w-[85vw] max-w-sm" style={{ bottom: sku ? 170 : 80 }}>
          <div className="bg-koala-navy text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-sm font-semibold">{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
}
