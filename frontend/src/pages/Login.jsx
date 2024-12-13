import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { login } from "@services/auth.service.js";
import useLogin from "@hooks/auth/useLogin.jsx";
import icono from "../images/components/icono.svg";
import eyeo from "../images/components/eyeo.svg";
import eyec from "../images/components/eyec.svg";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const {
    errorEmail,
    errorPassword,
    errorData,
    handleInputChange,
    inputData,
  } = useLogin();

  const [loginError, setLoginError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const loginSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: inputData.email,
      password: inputData.password,
    };
  
    try {
      const response = await login(data);
      if (response.status === "Success") {
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        if (usuario && usuario.rol === "Alumno") {
          navigate("/asignaturas"); // Redirect students to the assignment selection page
        } else {
          navigate("/cursos"); // Redirect other users to the courses page
        }
      } else if (response.status === "Client error") {
        setLoginError("Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.log(error);
      setLoginError("Hubo un problema al intentar iniciar sesión. Intenta nuevamente.");
    }
  };

    sessionStorage.getItem('usuario')
  return (
    <div
      style={{
        backgroundColor: "#111827",
        backgroundImage: `url(/patern.svg)`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {loginError && (
        <div
          role="alert"
          className="alert alert-error fixed top-0 left-1/2 transform -translate-x-1/2 z-50 mb-4 mt-4 w-auto p-4 flex items-center bg-[#111827] text-red-500 rounded-lg shadow-lg animate-bounce-slow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current text-red-500" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-500">{loginError}</span>
        </div>
      )}

      <motion.div
        className="relative z-10 w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        <div className="text-center">
          <img
            src={icono}
            alt="Logo"
            className="w-16 h-16 mx-auto"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-200">¡Bienvenido!</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={loginSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-500 dark:text-gray-300">
              Correo electronico
            </label>
            <div className="relative flex items-center mt-2">
              <span className="absolute">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#3B82F6" className="w-6 h-6 mx-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <input
                id="email"
                name="email"
                required
                placeholder="correo@prueba.com"
                className="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            {errorEmail && (
              <p className="mt-1 text-xs text-red-500">Email es obligatorio</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm text-gray-500 dark:text-gray-300">
                Contraseña
              </label>
            </div>

            <div className="relative flex items-center mt-2">
              <button
                type="button"
                className="absolute right-0 focus:outline-none rtl:left-0 rtl:right-auto"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                <img
                  src={passwordVisible ? eyeo : eyec}
                  alt="Mostrar/Ocultar contraseña"
                  className="w-6 h-6 mx-4"
                />
              </button>
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                required
                placeholder="********"
                className="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-5 pr-11 rtl:pr-5 rtl:pl-11 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
            {errorPassword && (
              <p className="mt-1 text-xs text-red-500">Contraseña es obligatoria</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Iniciar Sesión
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
