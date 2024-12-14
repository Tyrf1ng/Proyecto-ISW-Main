// src/hooks/anotaciones/useAlerts.jsx
import { useState } from "react";

const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 3500);
  };

  return [alert, showAlert];
};

export default useAlert;
