import '../locales/i18n';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from '@/app/routes';
import { ViewModeProvider } from '@/app/context/ViewModeContext';
import { AuthProvider } from '@/app/context/AuthContext';
import ScrollToTop from '@/app/components/common/ScrollToTop';
import StartupFlow from '@/mobile/screens/StartupFlow';
import BottomNav from '@/mobile/components/BottomNav';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StartupFlow>
          <ScrollToTop />
          <AuthProvider>
            <ViewModeProvider>
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
