import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router';
import instance from '@/api/instance';

/**
 * 푸시 알림 훅
 *
 * [사전 준비 - TODO]
 * 1. Firebase 프로젝트 생성: https://console.firebase.google.com
 * 2. Android 앱 등록 후 google-services.json 다운로드
 * 3. android/app/google-services.json 에 파일 배치
 * 4. android/build.gradle에 Google Services 플러그인 추가
 * 5. 백엔드에 FCM 토큰 저장 API 연동 (현재 TODO 처리)
 *
 * [알림 클릭 시 이동 경로]
 * 알림 payload의 data.path 값으로 이동
 * 예) { data: { path: '/account/orders/ORD-001' } }
 */
export function usePushNotifications() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setup = async () => {
      // 권한 요청
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') {
        console.log('[Push] 알림 권한 거부됨');
        return;
      }

      // FCM 등록
      await PushNotifications.register();

      // FCM 토큰 수신
      await PushNotifications.addListener('registration', async (token) => {
        console.log('[Push] FCM 토큰:', token.value);
        try {
          await instance.post('/api/v1/users/me/push-token', { token: token.value });
        } catch {
          // 토큰 저장 실패 시 무시 (로그인 전일 수 있음)
        }
      });

      // 등록 실패
      await PushNotifications.addListener('registrationError', (err) => {
        console.error('[Push] 등록 실패:', err);
      });

      // 포그라운드에서 알림 수신
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('[Push] 포그라운드 알림:', notification);
        // 필요 시 인앱 토스트 표시
      });

      // 알림 클릭 시 (백그라운드/종료 상태에서 클릭)
      await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        const path = action.notification.data?.path as string | undefined;
        if (path) {
          navigate(path);
        }
      });
    };

    setup().catch(console.error);

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [navigate]);
}
