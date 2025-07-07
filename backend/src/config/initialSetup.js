"use strict";
import User from "../entity/user.entity.js";
import Rol from "../entity/rol.js";
import Estado from "../entity/Estado.js"
import EstadoAsistencia from "../entity/EstadoAsistencia.js"

import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";


async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Salazar Jara",
          rut: "21.308.770-3",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          id_rol: 1,
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21.151.897-9",
          email: "vecino1.2024@gmail.cl",
          password: await encryptPassword("vecino1234"),
          id_rol: 2,
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Vicente Castillo González",
          rut: "21.005.789-7",
          email: "presidente2024@gmail.cl",
          password: await encryptPassword("presidente1234"),
          id_rol: 3,
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Jose Manuel Araya",
          rut: "21.005.123-3",
          email: "tesorero2024@gmail.cl",
          password: await encryptPassword("tesorero1234"),
          id_rol: 5,
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Marcos Araya",
          rut: "22.123.765-4",
          email: "secretario2024@gmail.cl",
          password: await encryptPassword("secretario1234"),
          id_rol: 4,
        })
      )
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

async function crearRoles() {
  try {
    const rolRepository = AppDataSource.getRepository(Rol);

    const count = await rolRepository.count();
    if (count > 0) return;

    await Promise.all([
      rolRepository.save(
        rolRepository.create({
        nombreRol: "Administrador",
        }),
      ),
      rolRepository.save(
        rolRepository.create({
          nombreRol: "Vecino",
        }),
      ),
      rolRepository.save(
        rolRepository.create({
        nombreRol: "Presidente",
        }),
      ),
      rolRepository.save(
        rolRepository.create({
        nombreRol: "Secretario",
        }),
      ),
      rolRepository.save(
        rolRepository.create({
        nombreRol: "Tesorero",
        }),
      )
      ])
    } catch (error) {
    console.error("Error al crear roles:", error);
  }
}


async function createEstado(){
  try {
    const estadoRepository = AppDataSource.getRepository(Estado);

    const count = await estadoRepository.count();
    if (count > 0) return;
    await Promise.all([
      estadoRepository.save(
        estadoRepository.create({
          nombreEstado: "Pendiente"
        }),
      ),
      estadoRepository.save(
        estadoRepository.create({
          nombreEstado: "Realizada"
        }),
      ),
      estadoRepository.save(
        estadoRepository.create({
          nombreEstado: "Suspendida"
        }),
      ),
    ])
  } catch (error) {
    console.error("Error al crear estados:",error);
  }
}

async function createEstadoAsistencia(){
  try {
    const estadoAsistenciaRepository = AppDataSource.getRepository(EstadoAsistencia);

    const count = await estadoAsistenciaRepository.count();
    if (count > 0) return;
    await Promise.all([
      estadoAsistenciaRepository.save(
        estadoAsistenciaRepository.create({
          nombre_estado_asistencia: "Ausente"
        }),
      ),
      estadoAsistenciaRepository.save(
        estadoAsistenciaRepository.create({
          nombre_estado_asistencia: "Presente"
        }),
      ),
    ])
  } catch (error) {
    console.error("Error al crear estados de asistencia:",error);
  }
}
export { crearRoles, createUsers, createEstado, createEstadoAsistencia }; 
