import { AppDataSource } from "../config/configDb.js";
import Votaciones from "../entity/Votacion.js";
import OpcionesVotoE from "../entity/OpcionesVotoE.js";

export async function createVotacionService({
  titulo_votacion,
  descripcion_votacion,
  fecha_votacion,
  hora_inicio,
  hora_termino,
  id_usuario,
  opciones // <-- recibe el array de opciones
}) {
  try {
    const votacionRepo = AppDataSource.getRepository(Votaciones);
    const miembroRepo = AppDataSource.getRepository("DirectivaMiembro");
    const opcionesRepo = AppDataSource.getRepository(OpcionesVotoE);

    // Verificar si el usuario es parte de alguna directiva activa
    const miembro = await miembroRepo.findOne({
      where: { id_usuario },
      relations: ["periodo"],
    });

    if (!miembro) {
      return [null, "Solo miembros de la directiva pueden crear votaciones"];
    }

    // Validar mínimo 2 opciones
    if (!Array.isArray(opciones) || opciones.length < 2) {
      return [null, "Debes ingresar al menos 2 opciones para la votación"];
    }

    const nuevaVotacion = votacionRepo.create({
      titulo_votacion,
      descripcion_votacion,
      fecha_votacion,
      hora_inicio,
      hora_termino,
      usuario: { id_usuario },
      periodo: { id_periodo: miembro.periodo.id_periodo },
    });

    const guardado = await votacionRepo.save(nuevaVotacion);

    // Guardar las opciones asociadas a la votación
    for (const texto_opcion of opciones) {
      const opcion = opcionesRepo.create({
        texto_opcion,
        votacion: guardado // asumiendo relación ManyToOne
      });
      await opcionesRepo.save(opcion);
    }

    return [guardado, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function deleteVotacionService({ id_votacion }) {
  try {
    const votacionRepo = AppDataSource.getRepository(Votaciones);

    // Buscar el evento por ID
    const votacion = await votacionRepo.findOne({ where: { id_votacion } });

    if (!votacion) {
      return [null, "Votación no encontrada"];
    }

    // Eliminar el evento
    await votacionRepo.remove(votacion);
    return [votacion, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function obtenerVotacionPorId(id_votacion) {
  try {
    const votacionRepo = AppDataSource.getRepository(Votaciones);

    const votacion = await votacionRepo.findOne({
      where: { id_votacion: parseInt(id_votacion) },
      relations: ["usuario", "periodo", "votos"], // Ajusta según tus relaciones reales
    });

    if (!votacion) {
      const error = new Error("Votación no encontrada");
      error.status = 404;
      throw error;
    }

    return votacion;
  } catch (error) {
    throw error;
  }
}

export async function obtenerTodasLasVotaciones() {
  try {
    const votacionRepo = AppDataSource.getRepository(Votaciones);
    return await votacionRepo.find({
      relations: ["usuario", "periodo", "votos"], // ajusta según tus relaciones
      order: { fecha_votacion: "DESC" }
    });
  } catch (error) {
    throw error;
  }
}