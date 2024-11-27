"use strict";
import passport from "passport";
import {
  handleErrorClient,
  handleErrorServer,
  } from "../handlers/responseHandlers.js";

export function authenticateJwt(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return handleErrorServer(
        res,
        500,
        "Error de autenticación en el servidor"
      );
    }

    if (!user) {
      return handleErrorClient(
        res,
        401,
        "No tienes permiso para acceder a este recurso",
        { info: info ? info.message : "No se encontró el usuario" }
      );
    }
    
    // Incluye rol y nombre en la solicitud
    req.user = {
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.roles?.nombre,
    };
    next();
  })(req, res, next);
}