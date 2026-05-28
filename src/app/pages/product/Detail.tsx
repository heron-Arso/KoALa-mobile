import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Navigation from '@/app/components/layouts/Header';
import { getSku } from '@/api/sku';
import { getArtist } from '@/api/artist';
import { addCartItem } from '@/api/cart';
import { addWishlist, removeWishlist, checkWishlist } from '@/api/wishlist';
import { CART_QUERY_KEY } from '@/app/hooks/useCart';
import type { Sku, Artist } from '@/api/types';

import {
  ProductSkeleton,
  ProductNotFound,
  ProductToast,
  ProductImageGallery,
  ProductInfo,
  ProductActions,
} from '@/app/components/products';
import {
  ArtImages,
  ArtMaterial,
  ArtPackaging,
  ArtArtist,
  ArtInfo,
  ArtQnA,
} from '@/app/components/ArtDetail';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [sku, setSku] = useState<Sku | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCartLink, setShowCartLink] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setSelectedImage(0);
    setSelectedColor(undefined);

    const fetchSku = async () => {
      setLoading(true);
      try {
        const res = await getSku(id!);
        const skuData: Sku = res.data.data;
        setSku(skuData);

        // 작가 정보 (선택)
        if ((skuData as any).artistCode) {
          try {
            const artistRes = await getArtist((skuData as any).artistCode);
            setArtist(artistRes.data.data);
          } catch { /* artist 없으면 이름만 표시 */ }
        }

        try {
          const wishRes = await checkWishlist(id!);
          setIsWishlisted(wishRes.data.data);
        } catch {
          // not authenticated — wishlist state stays false
        }
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSku();
  }, [id]);

  const showToastMessage = (message: string, isCart: boolean = false) => {
    setToastMessage(message);
    setShowCartLink(isCart);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToCart = async () => {
    if (!sku) return;
    setCartLoading(true);
    try {
      await addCartItem(sku.skuCode, 1);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      showToastMessage(t('product.detail.toast.cartAdded'), true);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToastMessage(msg || t('product.detail.toast.cartAddFailed'));
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!sku) return;
    try {
      if (isWishlisted) {
        await removeWishlist(sku.skuCode);
        setIsWishlisted(false);
        showToastMessage(t('product.detail.toast.wishlistRemoved'));
      } else {
        await addWishlist(sku.skuCode);
        setIsWishlisted(true);
        showToastMessage(t('product.detail.toast.wishlistAdded'));
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToastMessage(msg || t('product.detail.toast.error'));
    }
  };

  // mediaList 필터링을 useMemo로 캐싱 — 자식 컴포넌트 불필요한 리렌더링 방지
  const images = useMemo(() => {
    if (!sku) return [];
    return sku.mediaList && sku.mediaList.length > 0
      ? sku.mediaList.map((m) => m.fileUrl)
      : [sku.primaryImageUrl ?? 'https://via.placeholder.com/400'];
  }, [sku]);

  const detailImgs = useMemo(
    () =>
      (sku?.mediaList ?? [])
        .filter((m) => m.mediaRole === 'DETAIL')
        .map((m) => m.fileUrl),
    [sku?.mediaList],
  );

  const materialImgs = useMemo(
    () =>
      (sku?.mediaList ?? [])
        .filter((m) => m.mediaRole === 'MATERIAL')
        .map((m) => m.fileUrl),
    [sku?.mediaList],
  );

  const packagingImgs = useMemo(
    () =>
      (sku?.mediaList ?? [])
        .filter((m) => m.mediaRole === 'PACKAGING')
        .map((m) => m.fileUrl),
    [sku?.mediaList],
  );

  const artInfoItems = useMemo(
    () => [
      { label: '소재', value: sku?.material ?? '-' },
      { label: '크기', value: sku?.widthCm ? `${sku.widthCm}cm × ${sku.heightCm}cm` : '-' },
      { label: '무게', value: sku?.weightKg ? `${sku.weightKg}kg` : '-' },
      { label: '배달비용', value: '-' },
    ],
    [sku?.material, sku?.widthCm, sku?.heightCm, sku?.weightKg],
  );

  if (loading) return <ProductSkeleton />;
  if (!sku) return <ProductNotFound />;

  return (
    <div className="min-h-screen bg-white relative">
      <Navigation />

      <ProductToast
        show={showToast}
        message={toastMessage}
        showCartLink={showCartLink}
        onClose={() => setShowToast(false)}
      />

      <div className="pt-28 pb-20 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('product.detail.back')}
          </button>

          {/* Main layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-14">
            {/* Image gallery */}
            <ProductImageGallery
              sku={sku}
              images={images}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />

            {/* Info + Actions */}
            <div className="flex flex-col">
              <ProductInfo
                sku={sku}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
              <ProductActions
                sku={sku}
                cartLoading={cartLoading}
                isWishlisted={isWishlisted}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlist}
              />
            </div>
          </div>

          {/* 작품 상세 이미지 + 재질/소재 + 포장 + 작가 + 작품 소개 + QnA */}
          <div className="mt-16 border-t border-gray-100 pt-12 max-w-2xl mx-auto">
            <ArtImages images={detailImgs} title={sku.name} />
            <ArtMaterial
              images={materialImgs}
              description={sku.materialDescription}
              title={sku.name}
            />
            <ArtPackaging
              images={packagingImgs}
              packagingTitle={sku.packagingTitle}
              packagingDescription={sku.packagingDescription}
              title={sku.name}
            />
            <ArtArtist
              artistCode={(sku as any).artistCode}
              artistName={sku.artistName}
              artistDescription={artist?.description}
              artistImageUrl={artist?.profileImageUrl}
            />
            <ArtInfo items={artInfoItems} />
            <ArtQnA />
          </div>
        </div>
      </div>
    </div>
  );
}
