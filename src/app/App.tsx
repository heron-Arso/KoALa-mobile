import '../locales/i18n';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from '@/app/routes';
import { ViewModeProvider } from '@/app/context/ViewModeContext';
import { AuthProvider } from '@/app/context/AuthContext';
import ScrollToTop from '@/app/components/common/ScrollToTop';
import StartupFlow from '@/mobile/screens/StartupFlow';
import BottomNav from '@/mobile/components/BottomNav';
import OfflineBanner from '@/mobile/components/OfflineBanner';
import { useBackButton } from '@/mobile/hooks/useBackButton';
import { useDeepLink } from '@/mobile/hooks/useDeepLink';
import { usePushNotifications } from '@/mobile/hooks/usePushNotifications';
import { useAppUpdate } from '@/mobile/hooks/useAppUpdate';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
});

/** 모바일 전용 기능을 한 곳에서 초기화 */
function MobileFeatures() {
  useBackButton();        // Android 뒤로가기 버튼
  useDeepLink();          // 딥링크 처리
  usePushNotifications(); // 푸시 알림
  useAppUpdate();         // 앱 업데이트 체크
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StartupFlow>
          <ScrollToTop />
          <AuthProvider>
            <ViewModeProvider>
              {/* 오프라인 배너 */}
              <OfflineBanner />

              {/* 모바일 전용 기능 초기화 */}
              <MobileFeatures />

              <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
                <main className="flex-1 pb-20">
                  <AppRoutes />
                </main>
                <BottomNav />
              </div>
            </ViewModeProvider>
          </AuthProvider>
        </StartupFlow>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
