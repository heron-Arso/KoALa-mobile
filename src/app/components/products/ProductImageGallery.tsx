import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface Props {
  sku: any;
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

// 세로 썸네일은 최대 5개까지만 노출한다.
const MAX_THUMBS = 5;

export function ProductImageGallery({ sku, images, selectedImage, setSelectedImage }: Props) {
  const visibleImages = images.slice(0, MAX_THUMBS);
  const extraCount = images.length - MAX_THUMBS;

  // 메인 이미지를 탭하면 다음 이미지로 순환 → 썸네일에 안 보이는 이미지도 접근 가능
  const goNext = () => {
    if (images.length <= 1) return;
    setSelectedImage((selectedImage + 1) % images.length);
  };

  return (
    <div className="flex gap-3 h-full">
      {/* Vertical thumbnail strip — 최대 5개 */}
      <div className="flex flex-col gap-2 w-[68px] flex-shrink-0">
        {visibleImages.map((image, index) => {
          const isLastVisible = index === MAX_THUMBS - 1 && extraCount > 0;
          const active =
            selectedImage === index || (isLastVisible && selectedImage >= MAX_THUMBS - 1);
          return (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-[68px] h-[68px] rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                active
                  ? 'border-gray-900 opacity-100'
                  : 'border-transparent opacity-45 hover:opacity-75'
              }`}
            >
              <ImageWithFallback
                src={image}
                alt={`${sku.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* 5개 초과분은 마지막 썸네일에 +N 으로 표시 */}
              {isLastVisible && (
                <span className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-sm font-semibold">
                  +{extraCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main image — 작품이 잘리지 않도록 object-contain, 탭하면 다음 이미지 */}
      <div
        className="flex-1 relative overflow-hidden rounded-2xl bg-gray-50 aspect-square cursor-pointer"
        onClick={goNext}
      >
        <ImageWithFallback
          src={images[selectedImage]}
          alt={sku.name}
          className="w-full h-full object-contain transition-opacity duration-200"
        />
        {/* 현재 이미지 위치 표시 */}
        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/55 text-white text-[11px] font-medium rounded-full px-2 py-0.5">
            {selectedImage + 1} / {images.length}
          </span>
        )}
      </div>
    </div>
  );
}
