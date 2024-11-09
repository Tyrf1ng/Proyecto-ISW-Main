import DashboardLayoutAccount from '@components/Dashboard';
import { AuthProvider } from '@context/AuthContext';

function Root() {
  return (
    <AuthProvider>
      <DashboardLayoutAccount />
    </AuthProvider>
  );
}

export default Root;
