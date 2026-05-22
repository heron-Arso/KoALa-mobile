import { useEffect, useRef } from 'react';
import { App } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';
import { Capacitor } from '@capacitor/core';
import { useNavigate, useLocation } from 'react-router';

/**
 * Android 하드웨어 뒤로가기 버튼 처리 훅
 *
 * - 홈('/') 에서 뒤로가기 → 종료 확인 다이얼로그
 * - 그 외 페이지 → navigate(-1)
 * - iOS는 스와이프 백 제스처가 있으므로 Android 전용
 */
export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);

  // location이 바뀔 때마다 ref 업데이트 (클로저 문제 방지)
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listenerPromise = App.addListener('backButton', async ({ canGoBack }) => {
      const currentPath = locationRef.current.pathname;

      // 홈 화면이면 종료 확인
      if (currentPath === '/') {
        const { value: confirmed } = await Dialog.confirm({
          title: '앱 종료',
          message: 'KOALA를 종료하시겠어요?',
          okButtonTitle: '종료',
          cancelButtonTitle: '취소',
        });
        if (confirmed) {
          App.exitApp();
        }
        return;
      }

      // 그 외 페이지는 뒤로가기
      if (canGoBack) {
        navigate(-1);
      } else {
        navigate('/', { replace: true });
      }
    });

    return () => {
      listenerPromise.then((l) => l.remove());
    };
  }, [navigate]);
}
