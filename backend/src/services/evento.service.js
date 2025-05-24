import { AppDataSource } from "../config/configDb.js";

export async function createEventoService({ nombreEvento, fechaEvento, lugar_evento, hora_inicio, hora_termino, id_usuario }) {
  try {
    const eventoRepo = AppDataSource.getRepository("Evento");
    const miembroRepo = AppDataSource.getRepository("DirectivaMiembro");

    // Verificar si el usuario es parte de alguna directiva activa
    const miembro = await miembroRepo.findOne({
      where: { id_usuario },
      relations: ["periodo"],
    });

    if (!miembro) {
      return [null, "Solo miembros de la directiva pueden crear eventos"];
    }

    const nuevoEvento = eventoRepo.create({
      nombreEvento,
      fechaEvento,
      lugar_evento,
      hora_inicio,
      hora_termino,
      usuario: { id_usuario },
      periodo: { id_periodo: miembro.periodo.id_periodo },
    });

    const guardado = await eventoRepo.save(nuevoEvento);
    return [guardado, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function getAllEventosService() {
  try {
    const eventoRepo = AppDataSource.getRepository("Evento");

    const eventos = await eventoRepo.find({
      relations: ["usuario", "periodo"],
      order: { fechaEvento: "ASC" },
    });

    return [eventos, null];
  } catch (error) {
    return [null, error.message];
  }
}
