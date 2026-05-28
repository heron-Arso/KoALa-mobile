import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router';

/**
 * 딥링크 처리 훅
 *
 * 지원하는 링크 형식:
 * - 유니버설 링크: https://koala-art.co.kr/artist/abc123
 * - 커스텀 스킴:   com.koala.app://artist/abc123 (AndroidManifest 에 등록된 스킴)
 *
 * Android manifest에 intent-filter 설정 필요 (android/app/src/main/AndroidManifest.xml)
 */
export function useDeepLink() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listenerPromise = App.addListener('appUrlOpen', (data) => {
      try {
        let pathname = '';

        if (data.url.startsWith('https://koala-art.co.kr')) {
          // 유니버설 링크: https://koala-art.co.kr/...
          const url = new URL(data.url);
          pathname = url.pathname + url.search;
        } else if (data.url.startsWith('com.koala.app://') || data.url.startsWith('koala://')) {
          // 커스텀 스킴: com.koala.app://artist/abc123 → /artist/abc123
          pathname = data.url.replace(/^(com\.koala\.app|koala):\/\/\/?/, '/');
        }

        if (pathname && pathname !== '/') {
          navigate(pathname);
        }
      } catch (e) {
        console.warn('[DeepLink] URL 파싱 실패:', data.url);
      }
    });

    return () => {
      listenerPromise.then((l) => l.remove());
    };
  }, [navigate]);
}
