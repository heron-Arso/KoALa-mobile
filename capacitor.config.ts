import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.koala.app',
  appName: 'KoALa',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      // 네이티브 스플래시 화면 설정 (앱 아이콘이 보이는 순간)
      launchShowDuration: 0,       // 즉시 숨김 (우리가 만든 인트로가 대신함)
      backgroundColor: '#000000',  // 배경색 (검정)
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',              // 상태바 아이콘 색상 (dark = 흰색 아이콘)
      backgroundColor: '#000000',
    },
  },
  android: {
    // ⚠️  allowMixedContent: true 는 프로덕션 빌드에서 절대 사용 금지
    // 로컬 개발 중 HTTP localhost가 필요할 때만 임시로 주석 해제
    // allowMixedContent: true,
    backgroundColor: '#000000',
  },
};

export default config;
