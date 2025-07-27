"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import {
  crearRoles,
  createEstado,
  createEstadoAsistencia,
  createUsers,
} from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

async function setupServer() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const app = express();

    app.disable("x-powered-by");

    app.use(
      cors({
        credentials: true,
        origin: true,
      }),
    );

    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      }),
    );

    app.use(
      json({
        limit: "1mb",
      }),
    );

    app.use(cookieParser());

    app.use(morgan("dev"));

    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(
      "/uploads/actas",
      express.static(path.join(__dirname, "uploads", "actas")),
    );
    app.use(
      "/uploads/certificadosResidencia",
      express.static(path.join(__dirname, "uploads", "certificadosResidencia")),
    );

    passportJwtSetup();

    app.use("/api", indexRoutes);

    app.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await setupServer();

    await crearRoles();
    await createUsers();
    await createEstado();
    await createEstadoAsistencia();
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error),
  );
/*
import formatDate from "./helpers/formatDate.js"
const fecha = new Date()
console.log(formatDate(fecha))
console.log(formatDate(fecha.setMonth(fecha.getMonth()+3)))
const a = formatDate(fecha.setMonth(fecha.getMonth()+3))
console.log(a)

const b = "14:00"
const c = "14:50"

const [hora1,min1] = b.split(":").map(Number)
const [hora2,min2] = c.split(":").map(Number)
if(hora2<=hora1){
  console.log("La hora 1 no puede ser mayor a la hora 2")
  console.log(hora1)
  console.log(hora2)
}
*/
