import DashboardLayoutAccount from '@components/Dashboard';
import { AuthProvider } from '@context/AuthContext';
import { CursoProvider } from '../context/CursoContext'; 
import { AsignaturaProvider } from '../context/AsignaturaContext';
import { UsuarioProvider } from '../context/UsuarioContext';

function Root() {
  return (
    <AuthProvider>
      <UsuarioProvider>
        <CursoProvider>
          <AsignaturaProvider>
            <DashboardLayoutAccount />
          </AsignaturaProvider>
        </CursoProvider>
      </UsuarioProvider>
    </AuthProvider>
  );
}

export default Root;
