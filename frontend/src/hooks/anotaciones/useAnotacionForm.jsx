import { useState, useContext, useEffect } from "react";
import { AsignaturaContext } from "../../context/AsignaturaContext";
import { createAnotacion } from "../../services/anotaciones.service.js";

const useAnotacionForm = (selectedAlumno, resetAlumnos, showAlert) => {
  const { asignatura } = useContext(AsignaturaContext);
  const [newAnotacion, setNewAnotacion] = useState({
    tipo: "Positiva",
    rut: "",
    descripcion: "",
    id_asignatura: asignatura.idAsignatura || "",
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (selectedAlumno) {
      setNewAnotacion((prev) => ({ ...prev, rut: selectedAlumno.rut }));
    }
  }, [selectedAlumno]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnotacion({ ...newAnotacion, [name]: value });
  };

  const handleSelectChange = (e) => {
    setNewAnotacion({ ...newAnotacion, tipo: e.target.value });
  };

  const isWithinAllowedHours = () => {
    const currentDate = new Date();
    const day = currentDate.getDay();
    const hour = currentDate.getHours();

    if (day === 0 || day === 6) {
      showAlert(
        "No se puede crear una anotación en sábado o domingo.",
        "warning"
      );
      return false;
    }

    if (hour < 8 || hour >= 18) {
      showAlert(
        "La hora para crear una anotación debe estar entre las 8 AM y las 6 PM.",
        "warning"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isWithinAllowedHours()) {
      return;
    }

    if (!newAnotacion.rut) {
      showAlert("Debe seleccionar un alumno.", "warning");
      return;
    }

    if (!newAnotacion.descripcion.trim()) {
      showAlert("La descripción no puede estar vacía.", "warning");
      return;
    }

    try {
      await createAnotacion(newAnotacion);
      showAlert("Anotación creada exitosamente", "success");

      setNewAnotacion({
        tipo: "Positiva",
        rut: "",
        descripcion: "",
        id_asignatura: asignatura.idAsignatura || "",
        createdAt: new Date().toISOString(),
      });
      resetAlumnos();
    } catch (error) {
      console.error("Error al crear la anotación:", error);
      showAlert("Hubo un error al crear la anotación", "error");
    }
  };

  const resetForm = () => {
    setNewAnotacion({
      tipo: "Positiva",
      rut: "",
      descripcion: "",
      id_asignatura: asignatura.idAsignatura || "",
      createdAt: new Date().toISOString(),
    });
  };

  return {
    newAnotacion,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    resetForm,
    setNewAnotacion,
  };
};

export default useAnotacionForm;
