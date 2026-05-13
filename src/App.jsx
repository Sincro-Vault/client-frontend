import './i18n';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import ToastContainer from './components/ui/Toast';
import SessionWarningBanner from './components/ui/SessionWarningBanner';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useAuthStore } from './store/authStore';

// Must be inside BrowserRouter so useNavigate works
function SessionBannerWrapper() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <SessionWarningBanner /> : null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SessionBannerWrapper />
        <AppRouter />
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
