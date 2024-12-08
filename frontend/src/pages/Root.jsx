import DashboardLayoutAccount from '@components/Dashboard';
import { AuthProvider } from '@context/AuthContext';
import { CursoProvider } from '../context/CursoContext';
import { UsuarioProvider } from '../context/UsuarioContext';

function Root() {
  return (
    <AuthProvider>
      <UsuarioProvider>
        <CursoProvider>
          <DashboardLayoutAccount />
        </CursoProvider>
      </UsuarioProvider>
    </AuthProvider>
  );
}

export default Root;
