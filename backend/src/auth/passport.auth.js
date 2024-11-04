"use strict";
import passport from "passport";
import Docentes from "../entity/docente.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Apoderado from "../entity/apoderado.entity.js";
import Administrativo from "../entity/administrativo.entity.js";
import Directivo from "../entity/directivo.entity.js";
import Encargado_Lab from "../entity/encargado.lab.entity.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { AppDataSource } from "../config/configDb.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const repositories = [
        AppDataSource.getRepository(Directivo),
        AppDataSource.getRepository(Docentes),
        AppDataSource.getRepository(Apoderado),
        AppDataSource.getRepository(Alumno),
        AppDataSource.getRepository(Administrativo),
        AppDataSource.getRepository(Encargado_Lab),
      ];

      let user = null;
      for (const repository of repositories) {
        user = await repository.findOne({
          where: { email: jwt_payload.email },
        });
        if (user) break; // Sale del bucle si encuentra al usuario
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export function passportJwtSetup() {
  passport.initialize();
}