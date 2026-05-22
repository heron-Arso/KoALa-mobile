import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

/**
 * 네트워크 연결 상태를 감지하는 훅
 *
 * - 온라인/오프라인 전환 시 isOnline 상태 업데이트
 * - 웹 브라우저에서는 navigator.onLine 사용
 */
export function useNetwork() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      // 웹 환경 fallback
      const handleOnline  = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      setIsOnline(navigator.onLine);
      window.addEventListener('online',  handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online',  handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // 초기 상태 확인
    Network.getStatus().then(({ connected }) => setIsOnline(connected));

    // 변경 감지
    const listenerPromise = Network.addListener('networkStatusChange', ({ connected }) => {
      setIsOnline(connected);
    });

    return () => {
      listenerPromise.then((l) => l.remove());
    };
  }, []);

  return { isOnline };
}
