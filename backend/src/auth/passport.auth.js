"use strict";
import passport from "passport";
import Usuario from "../entity/usuario.entity.js";
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
        AppDataSource.getRepository(Usuario),
      ];

      let user = null;
      for (const repository of repositories) {
        user = await repository.findOne({
          where: { email: jwt_payload.email },
        });
        if (user) break; 
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