import { useNetwork } from '@/mobile/hooks/useNetwork';

/**
 * 오프라인 상태일 때 상단에 표시되는 배너
 */
export default function OfflineBanner() {
  const { isOnline } = useNetwork();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gray-900 text-white text-center text-xs py-2 px-4 flex items-center justify-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
      인터넷 연결이 없어요. 연결 상태를 확인해 주세요.
    </div>
  );
}
