import type { CapacitorConfig } from '@capacitor/cli';

// 앱은 로컬 번들(dist)을 사용한다. (모바일 전용 UX — 하단 탭바·인트로·오프라인 배너 등)
// 외부 URL(아래 allowNavigation)은 OAuth/토스 결제 흐름에서 WebView 이동을 허용하기 위함이다.
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
