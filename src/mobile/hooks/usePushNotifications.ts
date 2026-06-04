import { useEffect, useRef } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router';
import instance from '@/api/instance';
import { useAuth } from '@/app/context/AuthContext';

/**
 * 푸시 알림 훅
 *
 * [동작]
 * 1. 네이티브에서 알림 권한 요청 + FCM 등록 → 토큰 수신
 * 2. 토큰 수신 시 보관(메모리 + localStorage) 후 서버 전송 시도
 *    - 앱 실행 직후엔 아직 로그인 전일 수 있어 전송이 실패할 수 있음(401)
 * 3. 로그인 성공(isAuthenticated=true) 시점에 보관된 토큰을 재전송
 *    → "켤 때 비로그인이라 저장 실패 → 로그인 후 미전송" 문제 해결
 *
 * [사전 준비 - TODO]
 * - Firebase 프로젝트 생성 후 android/app/google-services.json 배치
 * - android/build.gradle 에 Google Services 플러그인 추가
 *
 * [알림 클릭 시 이동 경로] 알림 payload의 data.path 값으로 이동
 */
const PUSH_TOKEN_KEY = 'fcmToken';

/** 저장된 FCM 토큰을 서버에 전송 (로그인 상태에서만 성공, 실패는 무시) */
async function sendPushToken(token: string) {
  try {
    await instance.post('/api/v1/users/me/push-token', { token });
  } catch {
    // 비로그인 등 — 무시 (로그인 후 재시도됨)
  }
}

export function usePushNotifications() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const tokenRef = useRef<string | null>(
    typeof localStorage !== 'undefined' ? localStorage.getItem(PUSH_TOKEN_KEY) : null,
  );

  // 1) 네이티브 푸시 등록 + 토큰 수신
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

      // FCM 토큰 수신 → 보관 후 전송 시도(이미 로그인 상태면 즉시 저장됨)
      await PushNotifications.addListener('registration', async (token) => {
        console.log('[Push] FCM 토큰 수신');
        tokenRef.current = token.value;
        try {
          localStorage.setItem(PUSH_TOKEN_KEY, token.value);
        } catch {
          // localStorage 사용 불가 환경 — 무시
        }
        await sendPushToken(token.value);
      });

      // 등록 실패
      await PushNotifications.addListener('registrationError', (err) => {
        console.error('[Push] 등록 실패:', err);
      });

      // 포그라운드에서 알림 수신
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('[Push] 포그라운드 알림:', notification);
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

  // 2) 로그인 성공 시 보관된 토큰 재전송 (켤 때 비로그인이라 실패했던 케이스 보강)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (isAuthenticated === true && tokenRef.current) {
      sendPushToken(tokenRef.current);
    }
  }, [isAuthenticated]);
}
