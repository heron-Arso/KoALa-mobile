import { useState } from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, description, url, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? window.location.href;

  const handleShare = async () => {
    // 네이티브 공유 시트 (Capacitor/모바일 브라우저)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description ?? 'KoALa — Korean Art Lab',
          url: shareUrl,
        });
        return;
      } catch (e) {
        // 사용자가 취소하거나 실패 → 링크 복사로 폴백
      }
    }
    // 폴백: 링크 복사
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <button
        onClick={handleShare}
        className={`inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full border border-gray-200 text-gray-700 font-bold text-sm active:scale-95 transition-all ${className}`}
      >
        <Share2 className="w-4 h-4" />
        공유
      </button>

      {/* 복사 완료 토스트 */}
      {copied && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-koala-navy text-white text-sm px-5 py-2.5 rounded-full z-50 pointer-events-none shadow-lg">
          링크가 복사됐습니다 ✓
        </div>
      )}
    </>
  );
}