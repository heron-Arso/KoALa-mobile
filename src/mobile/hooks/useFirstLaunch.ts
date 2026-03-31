import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

const ONBOARDING_KEY = 'koala_onboarding_completed';

/**
 * 앱 최초 실행 여부를 감지하는 훅
 *
 * [웹 localStorage와의 차이]
 * - localStorage: 브라우저 데이터 삭제 시 초기화 (앱 삭제와 무관)
 * - Capacitor Preferences: 실제 앱 삭제 시 초기화 → 진짜 "재설치 후 첫 실행" 감지 가능
 */
export function useFirstLaunch() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null); // null = 아직 확인 중

  useEffect(() => {
    Preferences.get({ key: ONBOARDING_KEY }).then(({ value }) => {
      setIsFirstLaunch(value === null);
    });
  }, []);

  const markOnboardingComplete = async () => {
    await Preferences.set({ key: ONBOARDING_KEY, value: 'true' });
    setIsFirstLaunch(false);
  };

  return { isFirstLaunch, markOnboardingComplete };
}
