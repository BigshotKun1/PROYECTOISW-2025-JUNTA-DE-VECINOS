"use strict";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js"; // ruta y nombre real de tu entidad User
import { sendEmail } from "../middlewares/email.middleware.js";

export async function notifyVecinosEvento(evento) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const vecinos = await userRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.rol", "rol")
      .where("rol.nombreRol IN (:...roles)", {
        roles: ["Vecino", "Presidente", "Tesorero", "Secretario"],
      })
      .select(["user.email", "user.nombreCompleto"])
      .getMany();

    if (vecinos.length === 0) {
      console.log("No hay vecinos con esos roles para notificar.");
      return;
    }

    const fecha = new Date(evento.fechaEvento);
    const subject = `Nuevo evento: ${evento.nombreEvento}`;
    const htmlContent = `
      <h1>Nuevo Evento en la Comunidad</h1>
      <p>Estimado vecino,</p>
      <p>Se ha agendado un nuevo evento: <strong>${evento.nombreEvento}</strong>.</p>
      <p>Detalles:</p>
      <ul>
        <li><strong>Fecha:</strong> ${fecha.toLocaleDateString()}</li>
        <li><strong>Lugar:</strong> ${evento.lugar_evento}</li>
        <li><strong>Hora inicio:</strong> ${evento.hora_inicio}</li>
        <li><strong>Hora término:</strong> ${evento.hora_termino}</li>
      </ul>
      <p>¡Esperamos contar con tu participación!</p>
      <br />
      <p>Saludos,</p>
      <p>La Directiva</p>
    `;

    await Promise.all(
      vecinos.map(({ email }) => sendEmail(email, subject, htmlContent)),
    );

    console.log("Notificación enviada a todos los vecinos con rol autorizado.");
  } catch (error) {
    console.error("Error notificando a vecinos:", error);
  }
}

export async function notifyVecinosEventoActualizado(evento) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const vecinos = await userRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.rol", "rol")
      .where("rol.nombreRol IN (:...roles)", {
        roles: ["Vecino", "Presidente", "Tesorero", "Secretario"],
      })
      .select(["user.email", "user.nombreCompleto"])
      .getMany();

    if (vecinos.length === 0) {
      console.log("No hay vecinos con esos roles para notificar.");
      return;
    }

    const fecha = new Date(evento.fechaEvento);
    const subject = `Evento actualizado: ${evento.nombreEvento}`;
    const htmlContent = `
      <h1>Actualización de Evento</h1>
      <p>Estimado vecino,</p>
      <p>El evento <strong>${evento.nombreEvento}</strong> ha sido actualizado.</p>
      <p>Detalles actualizados:</p>
      <ul>
        <li><strong>Fecha:</strong> ${fecha.toLocaleDateString()}</li>
        <li><strong>Lugar:</strong> ${evento.lugar_evento}</li>
        <li><strong>Hora inicio:</strong> ${evento.hora_inicio}</li>
        <li><strong>Hora término:</strong> ${evento.hora_termino}</li>
      </ul>
      <p>¡Esperamos contar con tu participación!</p>
      <br />
      <p>Saludos,</p>
      <p>La Directiva</p>
    `;

    await Promise.all(
      vecinos.map(({ email }) => sendEmail(email, subject, htmlContent))
    );

    console.log("Notificación de evento actualizado enviada a todos los vecinos.");
  } catch (error) {
    console.error("Error notificando a vecinos sobre actualización:", error);
  }
}

export async function notifyVecinosEventoEliminado(evento) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const vecinos = await userRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.rol", "rol")
      .where("rol.nombreRol IN (:...roles)", {
        roles: ["Vecino", "Presidente", "Tesorero", "Secretario"],
      })
      .select(["user.email", "user.nombreCompleto"])
      .getMany();

    if (vecinos.length === 0) {
      console.log("No hay vecinos con esos roles para notificar.");
      return;
    }

    const fecha = new Date(evento.fechaEvento);
    const subject = `Evento cancelado: ${evento.nombreEvento}`;
    const htmlContent = `
      <h1>Cancelación de Evento</h1>
      <p>Estimado vecino,</p>
      <p>Lamentamos informar que el evento <strong>${evento.nombreEvento}</strong>, programado para el día <strong>${fecha.toLocaleDateString()}</strong>, ha sido cancelado.</p>
      <p>Agradecemos su comprensión.</p>
      <br />
      <p>Saludos,</p>
      <p>La Directiva</p>
    `;

    await Promise.all(
      vecinos.map(({ email }) => sendEmail(email, subject, htmlContent))
    );

    console.log("Notificación de evento eliminado enviada a todos los vecinos.");
  } catch (error) {
    console.error("Error notificando a vecinos sobre eliminación:", error);
  }
}


export async function notifyVecinosReuniones(reunion) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const vecinos = await userRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.rol", "rol")
      .where("rol.nombreRol IN (:...roles)", {
        roles: ["Vecino", "Presidente", "Tesorero", "Secretario"],
      })
      .select(["user.email", "user.nombreCompleto"])
      .getMany();

    if (vecinos.length === 0) {
      console.log("No hay vecinos con ese rol para notificar.");
      return;
    }
    const subject = `Nueva Reunion Agendada: ${reunion.descripcion_reunion}`;
    const htmlContent = `
      <h1>Nueva Reunion en la Comunidad</h1>
      <p>Estimado vecino,</p>
      <p>Se ha agendado una nueva Reunion</strong>.</p>
      <p>Detalles:</p>
      <ul>
        <li><strong>Fecha:</strong> ${reunion.fecha_reunion.split("-").reverse().join("-")}</li>
        <li><strong>Lugar:</strong> ${reunion.lugar_reunion}</li>
        <li><strong>Hora inicio:</strong> ${reunion.hora_inicio}</li>
        <li><strong>Hora término:</strong> ${reunion.hora_termino}</li>
      </ul>
      <p>¡Esperamos contar con tu participación!</p>
      <br />
      <p>Saludos,</p>
      <p>La Directiva</p>
    `;

    await Promise.all(
      vecinos.map(({ email }) => sendEmail(email, subject, htmlContent)),
    );

    console.log("Notificación enviada a todos los vecinos con rol 'vecino'.");
  } catch (error) {
    console.error("Error notificando a vecinos:", error);
  }
}

export async function notifyVecinosVotaciones(votacion) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const vecinos = await userRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.rol", "rol")
      .where("rol.nombreRol IN (:...roles)", {
        roles: ["Vecino", "Presidente", "Tesorero", "Secretario"],
      })
      .select(["user.email", "user.nombreCompleto"])
      .getMany();

    if (vecinos.length === 0) {
      console.log("No hay vecinos con ese rol para notificar.");
      return;
    }

    const subject = `Nueva Votacion: ${votacion.motivo_votacion}`;
    const htmlContent = `
      <h1>Nueva Votacion en la Comunidad</h1>
      <p>Estimado vecino,</p>
      <p>Se ha agendado una nueva Votacion: <strong>${votacion.motivo_votacion}</strong>.</p>
      <p>Detalles:</p>
      <ul>
        <li><strong>Fecha:</strong> ${votacion.fecha_votacion}</li>
        <li><strong>Hora inicio:</strong> ${votacion.hora_inicio}</li>
        <li><strong>Hora término:</strong> ${votacion.hora_termino}</li>
      </ul>
      <p>¡Esperamos contar con tu participación!</p>
      <br />
      <p>Saludos,</p>
      <p>La Directiva</p>
    `;

    await Promise.all(
      vecinos.map(({ email }) => sendEmail(email, subject, htmlContent)),
    );

    console.log("Notificación enviada a todos los vecinos con rol 'vecino'.");
  } catch (error) {
    console.error("Error notificando a vecinos:", error);
  }
}

export async function notifyInscritosReuniones(reunionDespues, id) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const vecinos = await userRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.rol", "rol")
      .where("rol.nombreRol IN (:...roles)", {
        roles: ["Vecino", "Presidente", "Tesorero", "Secretario"],
      })
      .select(["user.email", "user.nombreCompleto"])
      .getMany();

    if (vecinos.length === 0) {
      console.log("No hay vecinos con ese rol para notificar.");
      return;
    }
    const subject = "Cambio en la reunión programada";

    await Promise.all(
      vecinos.map(({ email, nombreCompleto }) => {
        const htmlContent = `
      <p>Estimado vecino,${nombreCompleto.toUpperCase()}</p>
      <p>Le informamos que la reunion: <strong> ${reunionDespues.descripcion_reunion} </strong></strong> ha sido modificada.</p>
      <p>Detalles:</p>
      <ul>
        <li><strong>Fecha:</strong> ${reunionDespues.fecha_reunion.split("-").reverse().join("-")}</li>
        <li><strong>Lugar:</strong> ${reunionDespues.lugar_reunion}</li>
        <li><strong>Hora inicio:</strong> ${reunionDespues.hora_inicio}</li>
        <li><strong>Hora término:</strong> ${reunionDespues.hora_termino}</li>
      </ul>
      <p>¡Esperamos contar con tu participación!</p>
      <br />
      <p>Saludos,</p>
      <p>La Directiva</p>
    `;
        return sendEmail(email, subject, htmlContent);
      }),
    );
    console.log("Notificación enviada a todos los vecinos inscritos.");
  } catch (error) {
    console.error("Error notificando a vecinos:", error);
  }
}

export async function notifyInscritosDeleteReuniones(reunion, id) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const vecinos = await userRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.rol", "rol")
      .where("rol.nombreRol IN (:...roles)", {
        roles: ["Vecino", "Presidente", "Tesorero", "Secretario"],
      })
      .select(["user.email", "user.nombreCompleto"])
      .getMany();

    if (vecinos.length === 0) {
      console.log("No hay vecinos con ese rol para notificar.");
      return;
    }
    const subject = "Reunion eliminada";

    await Promise.all(
      vecinos.map(({ email, nombreCompleto }) => {
        const htmlContent = `
      <p>Estimado vecino,${nombreCompleto.toUpperCase()}</p>
      <p>Le informamos que la reunion: <strong> ${reunion[0].descripcion_reunion} </strong> con fecha ${reunion[0].fecha_reunion.split("-").reverse().join("-")} ha sido eliminada.</p>
      <p>Saludos,</p>
      <p>La Directiva</p>
    `;
        return sendEmail(email, subject, htmlContent);
      }),
    );
    console.log("Notificación enviada a todos los vecinos inscritos.");
  } catch (error) {
    console.error("Error notificando a vecinos:", error);
  }
}
export async function notifyInscritosSuspensionReuniones(reunion, id) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const vecinos = await userRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.rol", "rol")
      .where("rol.nombreRol IN (:...roles)", {
        roles: ["Vecino", "Presidente", "Tesorero", "Secretario"],
      })
      .select(["user.email", "user.nombreCompleto"])
      .getMany();

    if (vecinos.length === 0) {
      console.log("No hay vecinos con ese rol para notificar.");
      return;
    }
    const subject = "Reunion suspendida";

    await Promise.all(
      vecinos.map(({ email, nombreCompleto }) => {
        const htmlContent = `
      <p>Estimado vecino,${nombreCompleto.toUpperCase()}</p>
      <p>Le informamos que la reunion: <strong> ${reunion.descripcion_reunion} </strong> con fecha ${reunion.fecha_reunion.split("-").reverse().join("-")} ha sido suspendida.</p>
      <p>Saludos,</p>
      <p>La Directiva</p>
    `;
        return sendEmail(email, subject, htmlContent);
      }),
    );
    console.log("Notificación enviada a todos los vecinos inscritos.");
  } catch (error) {
    console.error("Error notificando a vecinos:", error);
  }
}
