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

export async function deleteEventoService({ id_evento }) {
  try {
    const eventoRepo = AppDataSource.getRepository("Evento");

    // Buscar el evento por ID
    const evento = await eventoRepo.findOne({ where: { id_evento } });

    if (!evento) {
      return [null, "Evento no encontrado"];
    }

    // Eliminar el evento
    await eventoRepo.remove(evento);
    return [evento, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function updateEventoService({ id_evento, nombreEvento, fechaEvento, lugar_evento, hora_inicio, hora_termino }) {
  try {
    const eventoRepo = AppDataSource.getRepository("Evento");

    const evento = await eventoRepo.findOne({ where: { id_evento } });
    if (!evento) {
      return [null, "Evento no encontrado"];
    }

    // Validación mínima de horarios
    if (hora_inicio && hora_termino && hora_inicio >= hora_termino) {
      return [null, "La hora de inicio debe ser anterior a la hora de término"];
    }

    // Actualizar solo si el dato está definido
    if (nombreEvento !== undefined) evento.nombreEvento = nombreEvento;
    if (fechaEvento !== undefined) evento.fechaEvento = fechaEvento;
    if (lugar_evento !== undefined) evento.lugar_evento = lugar_evento;
    if (hora_inicio !== undefined) evento.hora_inicio = hora_inicio;
    if (hora_termino !== undefined) evento.hora_termino = hora_termino;

    const actualizado = await eventoRepo.save(evento);
    return [actualizado, null];
  } catch (error) {
    return [null, error.message];
  }
}
