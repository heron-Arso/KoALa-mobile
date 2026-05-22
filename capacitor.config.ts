import type { CapacitorConfig } from '@capacitor/cli';

// 빌드 환경에 따라 서버 URL 결정
// - 프로덕션: 실제 서버에서 직접 로드 (OAuth·Toss 결제가 웹과 동일하게 작동)
// - 개발: 로컬 번들 사용 (VITE_APP_ENV=development 일 때)
const isProd = process.env.NODE_ENV === 'production';

const config: CapacitorConfig = {
  appId: 'com.koala.app',
  appName: 'KoALa',
  webDir: 'dist',

  // ── 외부 URL 허용 (카카오/네이버 OAuth, 토스 결제) ──────────────────────────
  // WebView에서 아래 도메인으로의 이동을 허용
  allowNavigation: [
    // 카카오 로그인
    'kauth.kakao.com',
    'accounts.kakao.com',
    // 네이버 로그인
    'nid.naver.com',
    // 토스 결제
    '*.tosspayments.com',
    '*.toss.im',
    // KOALA 서비스 도메인
    'koala-art.co.kr',
    '*.koala-art.co.kr',
  ],

  // 프로덕션 빌드 시 서버에서 직접 로드
  // → 카카오/네이버 OAuth, Toss 결제가 추가 설정 없이 작동
  // → 앱 업데이트 없이 화면 수정 가능 (심사 불필요)
  ...(isProd && {
    server: {
      url: 'https://koala-art.co.kr',
      cleartext: false,
    },
  }),

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

  // ── iOS 인증서 피닝 (npx cap add ios 실행 후 적용) ───────────────────────────
  //
  // iOS 인증서 피닝은 네이티브 코드(AppDelegate.swift)에서 TrustKit으로 구현합니다.
  //
  // [설치]
  //   1. ios/App/Podfile 에 추가:
  //        pod 'TrustKit'
  //   2. pod install
  //
  // [AppDelegate.swift 설정]
  //   import TrustKit
  //
  //   func application(_ application: UIApplication,
  //                    didFinishLaunchingWithOptions ...) -> Bool {
  //     let trustKitConfig: [String: Any] = [
  //       kTSKSwizzleNetworkDelegates: true,
  //       kTSKPinnedDomains: [
  //         "api.your-domain.com": [
  //           kTSKEnforcePinning: true,
  //           kTSKIncludeSubdomains: true,
  //           kTSKExpirationDate: "2027-12-31",
  //           kTSKPublicKeyHashes: [
  //             "REPLACE_WITH_YOUR_CERT_PUBLIC_KEY_SHA256_BASE64==",  // 현재 인증서
  //             "REPLACE_WITH_BACKUP_CERT_PUBLIC_KEY_SHA256_BASE64==", // 백업 핀
  //           ],
  //         ],
  //       ],
  //     ]
  //     TrustKit.initSharedInstance(withConfiguration: trustKitConfig)
  //     return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  //   }
  //
  // [핀 값 추출]
  //   openssl s_client -connect api.your-domain.com:443 | \
  //   openssl x509 -pubkey -noout | \
  //   openssl pkey -pubin -outform der | \
  //   openssl dgst -sha256 -binary | base64
  //
  // [Info.plist NSAppTransportSecurity — 개발용 HTTP 허용 시]
  //   <key>NSAppTransportSecurity</key>
  //   <dict>
  //     <key>NSAllowsArbitraryLoads</key><false/>
  //     <key>NSExceptionDomains</key>
  //     <dict>
  //       <key>localhost</key>
  //       <dict>
  //         <key>NSExceptionAllowsInsecureHTTPLoads</key><true/>
  //       </dict>
  //     </dict>
  //   </dict>
};

export default config;
