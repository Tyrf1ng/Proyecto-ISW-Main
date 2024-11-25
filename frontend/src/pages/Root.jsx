import DashboardLayoutAccount from '@components/Dashboard';
import { AuthProvider } from '@context/AuthContext';
import { CursoProvider } from '../context/CursoContext'; // Asegúrate de importar el CursoProvider

function Root() {
  return (
    <AuthProvider>
      <CursoProvider> {/* Asegúrate de envolver tu aplicación con CursoProvider */}
        <DashboardLayoutAccount />
      </CursoProvider>
    </AuthProvider>
  );
}

export default Root;
