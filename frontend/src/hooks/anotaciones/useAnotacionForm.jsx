// src/hooks/anotaciones/useAnotacionForm.jsx
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

  const handleSubmit = async () => {
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

      // Resetear el formulario y selección
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
