import DashboardLayoutAccount from '@components/Dashboard';
import { AuthProvider } from '@context/AuthContext';
import { CursoProvider } from '../context/CursoContext'; 
import { AsignaturaProvider } from '../context/AsignaturaContext'; 

function Root() {
  return (
    <AuthProvider>
      <CursoProvider>
        <AsignaturaProvider> 
          <DashboardLayoutAccount />
        </AsignaturaProvider>
      </CursoProvider>
    </AuthProvider>
  );
}

export default Root;
