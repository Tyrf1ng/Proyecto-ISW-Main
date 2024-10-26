import Table from '@components/Table';
import useCursos from '@hooks/cursos/useGetCursos.jsx';
import '@styles/users.css';


const Home = () => {
  const { cursos } = useCursos();

  const columns = [
    { title: "ID", field: "id_Curso", width: 350, responsive: 0 },
    { title: "Nombre del curso", field: "nombreCurso", width: 300, responsive: 3 },
    { title: "Nivel", field: "nivel", width: 150, responsive: 2 },
    { title: "Rut del docente", field: "rutDocente", width: 200, responsive: 2 },
  ];

  return (
    <div className='main-container'>
    <div className='table-container'>
      <div className='top-table'>
        <h1 className='title-table'>Cursos</h1>
        </div>
        <Table
          data={cursos}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default Home;