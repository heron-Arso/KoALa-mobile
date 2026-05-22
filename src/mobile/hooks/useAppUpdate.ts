import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';
import { Capacitor } from '@capacitor/core';

// 현재 앱 버전 (package.json과 맞춰야 함)
const CURRENT_VERSION = '1.0.0';

/**
 * 앱 업데이트 확인 훅
 *
 * 앱 실행 시 서버에서 최소 요구 버전을 확인합니다.
 * - 강제 업데이트: 현재 버전 < 최소 요구 버전 → 플레이스토어로 이동
 * - 권장 업데이트: 새 버전 있음 → 선택적으로 이동
 *
 * TODO: 백엔드에 /api/v1/app/version 엔드포인트 추가 필요
 * 응답 형식: { minVersion: "1.0.0", latestVersion: "1.2.0", forceUpdate: false }
 */
export function useAppUpdate() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const checkUpdate = async () => {
      try {
        const res = await fetch('https://koala-art.co.kr/api/v1/app/version');
        if (!res.ok) return;

        const { data } = await res.json() as {
          data: { minVersion: string; latestVersion: string; forceUpdate: boolean; storeUrl: string }
        };

        const isOutdated = compareVersion(CURRENT_VERSION, data.minVersion) < 0;
        const hasUpdate  = compareVersion(CURRENT_VERSION, data.latestVersion) < 0;

        if (isOutdated || data.forceUpdate) {
          // 강제 업데이트
          await Dialog.alert({
            title: '업데이트 필요',
            message: '서비스 이용을 위해 최신 버전으로 업데이트해 주세요.',
            buttonTitle: '업데이트',
          });
          await App.openUrl({ url: data.storeUrl });
        } else if (hasUpdate) {
          // 권장 업데이트
          const { value: confirmed } = await Dialog.confirm({
            title: '새 버전 출시',
            message: '새로운 버전이 있어요. 지금 업데이트 하시겠어요?',
            okButtonTitle: '업데이트',
            cancelButtonTitle: '나중에',
          });
          if (confirmed) {
            await App.openUrl({ url: data.storeUrl });
          }
        }
      } catch {
        // 버전 체크 실패 시 무시 (앱 사용에 영향 없음)
      }
    };

    checkUpdate();
  }, []);
}

/** 버전 비교 (semver) — a < b: -1, a === b: 0, a > b: 1 */
function compareVersion(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return -1;
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return  1;
  }
  return 0;
}
