import { BrowserRouter } from 'react-router';
import { AppRoutes } from '@/app/routes';
import { ViewModeProvider } from '@/app/context/ViewModeContext';
import ScrollToTop from '@/app/components/common/ScrollToTop';
import StartupFlow from '@/mobile/screens/StartupFlow';
import BottomNav from '@/mobile/components/BottomNav';

function App() {
  return (
    <BrowserRouter>
      <StartupFlow>
        <ScrollToTop />
        <ViewModeProvider>
          <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            <main className="flex-1 pb-20">
              <AppRoutes />
            </main>
            <BottomNav />
          </div>
        </ViewModeProvider>
      </StartupFlow>
    </BrowserRouter>
  );
}

export default App;
