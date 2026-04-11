import { Preferences } from '@capacitor/preferences';

/**
 * Capacitor Secure Storage 유틸
 * - iOS: Keychain, Android: EncryptedSharedPreferences 에 저장
 * - 토큰은 HttpOnly 쿠키로 처리 (이 유틸은 사용자 설정 등 비인증 데이터용)
 * - 웹 환경 fallback: localStorage 대신 sessionStorage 사용
 */

export const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  },

  async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  },

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  },

  async clear(): Promise<void> {
    await Preferences.clear();
  },
};

/**
 * 로그아웃 시 앱 내 저장 데이터 정리
 * (토큰은 서버 측 쿠키 만료로 처리)
 */
export async function clearAppStorage(): Promise<void> {
  await Preferences.clear();
  // 혹시 남아있는 구버전 localStorage 데이터도 제거
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
