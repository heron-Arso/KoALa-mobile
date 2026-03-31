import { BrowserRouter } from 'react-router';
import { AppRoutes } from './routes.tsx';
import { ViewModeProvider } from './context/ViewModeContext';
import ScrollToTop from './components/common/ScrollToTop';
import StartupFlow from '../mobile/screens/StartupFlow';

function App() {
  return (
    <BrowserRouter>
      <StartupFlow>
        <ScrollToTop />
        <ViewModeProvider>
          <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            <main className="flex-1">
              <AppRoutes />
            </main>
          </div>
        </ViewModeProvider>
      </StartupFlow>
    </BrowserRouter>
  );
}

export default App;
