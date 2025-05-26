import { AppDataSource } from "../config/configDb.js"; 
import User  from "../entity/user.entity.js";       // ruta y nombre real de tu entidad User
import { sendEmail } from "../middlewares/email.middleware.js";

export async function notifyVecinosEvento(evento) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const vecinos = await userRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.rol", "rol")
      .where("rol.nombreRol = :rolNombre", { rolNombre: "Vecino" })
      .select(["user.email", "user.nombreCompleto"])
      .getMany();

    if (vecinos.length === 0) {
      console.log("No hay vecinos con ese rol para notificar.");
      return;
    }

    const subject = `Nuevo evento: ${evento.nombreEvento}`;
    const htmlContent = `
      <h1>Nuevo Evento en la Comunidad</h1>
      <p>Estimado vecino,</p>
      <p>Se ha agendado un nuevo evento: <strong>${evento.nombreEvento}</strong>.</p>
      <p>Detalles:</p>
      <ul>
        <li><strong>Fecha:</strong> ${evento.fechaEvento}</li>
        <li><strong>Lugar:</strong> ${evento.lugar_evento}</li>
        <li><strong>Hora inicio:</strong> ${evento.hora_inicio}</li>
        <li><strong>Hora término:</strong> ${evento.hora_termino}</li>
      </ul>
      <p>¡Esperamos contar con tu participación!</p>
      <br />
      <p>Saludos,</p>
      <p>La Directiva</p>
    `;

    await Promise.all(vecinos.map(({ email }) => sendEmail(email, subject, htmlContent)));

    console.log("Notificación enviada a todos los vecinos con rol 'vecino'.");

  } catch (error) {
    console.error("Error notificando a vecinos:", error);
  }
}
