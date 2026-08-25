import { useEffect, useState } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { useStatusBar } from '@/mobile/hooks/useStatusBar';

interface IntroScreenProps {
  onComplete: () => void;
}

/**
 * 앱 실행 시 항상 표시되는 브랜드 인트로 화면
 *
 * [네이티브 스플래시 화면 vs 이 인트로 화면의 차이]
 * - 네이티브 스플래시: OS가 앱을 로딩하는 동안 보여주는 정적 이미지 (capacitor.config.ts에서 설정)
 * - 이 인트로: 앱 JS가 실행된 후 React가 보여주는 애니메이션 화면
 * 둘이 이어지도록 네이티브 스플래시는 즉시 숨기고 이 화면이 바로 나타남
 */
export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<'initial' | 'logo' | 'tagline' | 'fadeout'>('initial');
  useStatusBar('dark'); // 인트로는 검정 배경 → 흰색 아이콘

  useEffect(() => {
    // 네이티브 스플래시 화면을 숨기고 우리 인트로가 시작됨
    if (Capacitor.isNativePlatform()) {
      SplashScreen.hide({ fadeOutDuration: 200 });
    }

    const t1 = setTimeout(() => setPhase('logo'), 300);
    const t2 = setTimeout(() => setPhase('tagline'), 1000);
    const t3 = setTimeout(() => setPhase('fadeout'), 2000);
    const t4 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-koala-navy flex flex-col items-center justify-center"
      style={{
        transition: 'opacity 0.7s ease-out',
        opacity: phase === 'fadeout' ? 0 : 1,
        pointerEvents: phase === 'fadeout' ? 'none' : 'all',
      }}
    >
      {/* 로고 */}
      <div
        style={{
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          opacity: phase === 'initial' ? 0 : 1,
          transform: phase === 'initial' ? 'scale(0.88) translateY(8px)' : 'scale(1) translateY(0)',
        }}
      >
        <h1
          className="text-white font-medium"
          style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', letterSpacing: '0.15em' }}
        >
          KoALa
        </h1>
      </div>

      {/* 구분선 */}
      <div
        style={{
          transition: 'opacity 0.5s ease-out, width 0.6s ease-out',
          opacity: phase === 'initial' || phase === 'logo' ? 0 : 1,
          width: phase === 'tagline' || phase === 'fadeout' ? '3rem' : '0',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.35)',
          margin: '1.25rem 0',
        }}
      />

      {/* 태그라인 */}
      <p
        className="text-white/50 tracking-[0.25em] uppercase"
        style={{
          fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          opacity: phase === 'initial' || phase === 'logo' ? 0 : 1,
          transform: phase === 'initial' || phase === 'logo' ? 'translateY(6px)' : 'translateY(0)',
        }}
      >
        Korean Art & Collectibles
      </p>
    </div>
  );
}
