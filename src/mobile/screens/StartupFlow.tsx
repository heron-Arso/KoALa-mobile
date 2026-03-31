import { useState } from 'react';
import { useNavigate } from 'react-router';
import IntroScreen from './IntroScreen';
import { useFirstLaunch } from '../hooks/useFirstLaunch';

interface StartupFlowProps {
  children: React.ReactNode;
}

/**
 * 앱 시작 흐름 관리 컴포넌트
 *
 * [흐름]
 * 앱 실행
 *   → IntroScreen (항상 표시, ~2.8초)
 *       → 최초 실행: /onboarding 이동
 *       → 기존 사용자: 홈(/) 유지
 */
export default function StartupFlow({ children }: StartupFlowProps) {
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();
  const { isFirstLaunch } = useFirstLaunch();

  const handleIntroComplete = () => {
    setShowIntro(false);
    // isFirstLaunch가 null이면 아직 체크 중 → 안전하게 false로 처리
    if (isFirstLaunch === true) {
      navigate('/onboarding', { replace: true });
    }
  };

  return (
    <>
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      {children}
    </>
  );
}
