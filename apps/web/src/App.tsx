import { Dashboard } from './pages/Dashboard';
import { NotificationProvider } from './components/NotificationProvider';

export default function App() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Dashboard />
      </div>
    </NotificationProvider>
  );
}
