import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

/**
 * 상태바(배터리, 시간 표시줄) 스타일을 제어하는 훅
 *
 * [상태바란?]
 * 스마트폰 상단에 시간, 배터리, 와이파이 아이콘이 있는 영역
 * 인트로 화면(검정 배경)에서는 아이콘이 흰색이어야 잘 보임
 */
export function useStatusBar(style: 'dark' | 'light' = 'dark') {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return; // 웹 브라우저에서는 무시

    StatusBar.setStyle({
      style: style === 'dark' ? Style.Dark : Style.Light,
    });
  }, [style]);
}
