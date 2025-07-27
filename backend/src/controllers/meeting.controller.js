"use strict";
import {
  meetingBodyValidation,
  meetingParamsValidation,
} from "../validations/meeting.validation.js";
import { AppDataSource } from "../config/configDb.js";
import Meeting from "../entity/Reunion.js";
import {
  createMeetingService,
  deleteMeetingService,
  getMeetingService,
  getMeetingsService,
  updateMeetingService,
} from "../services/meeting.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import {
  notifyInscritosDeleteReuniones,
  notifyInscritosReuniones,
  notifyInscritosSuspensionReuniones,
  notifyVecinosReuniones,
} from "../services/email.service.js";

export async function createMeeting(req, res) {
  try {
    const { body } = req;

    const { error } = meetingBodyValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [meetingSaved, errorMeeting] = await createMeetingService(body);
    console.log("error al crear reu:", errorMeeting);
    if (errorMeeting) {
      return handleErrorClient(
        res,
        400,
        "Error al crear reunión",
        errorMeeting,
      );
    }

    await notifyVecinosReuniones(meetingSaved);

    return handleSuccess(res, 201, "Reunión creada exitosamente", meetingSaved);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

export async function getMeeting(req, res) {
  try {
    const { id } = req.params;
    //console.log(id)
    const { error } = meetingParamsValidation.validate({ id });
    //console.log(error);
    //console.log(value);
    if (error) return handleErrorClient(res, 400, error.message);

    //console.log(id);

    const [meeting, Meetingerror] = await getMeetingService(id);

    if (Meetingerror) return handleErrorClient(res, 400, Meetingerror);

    handleSuccess(res, 200, "La reunion fue obtenida exitosamente", meeting);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getMeetings(req, res) {
  try {
    const [meetings, error] = await getMeetingsService();
    //console.log(meetings)
    if (!meetings) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Se obtuvieron las reuniones con exito", meetings);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateMeeting(req, res) {
  try {
    const id = req.params.id;
    const meetingRepository = AppDataSource.getRepository(Meeting);

    const reunion = await meetingRepository
      .createQueryBuilder("r")
      .innerJoinAndSelect("r.estado", "e")
      .where("r.id_reunion = :id", { id })
      .getOne();
    console.log(reunion);
    if (!reunion)
      return handleErrorClient(res, 404, "No se encontró la reunion");

    const newDataMeeting = req.body;
    const { value, error } = meetingBodyValidation.validate(newDataMeeting);
    console.log("❌ Error de validación:", error);
    if (error) return handleErrorClient(res, 400, error.message);
    const [meetingUpdated, errorMeeting] = await updateMeetingService(
      id,
      value,
    );

    const reunionMod = await meetingRepository
      .createQueryBuilder("r")
      .innerJoinAndSelect("r.estado", "e")
      .where("r.id_reunion = :id", { id })
      .getOne();
    console.log(reunionMod);
    if (
      reunion.estado.id_estado != reunionMod.estado.id_estado &&
      reunionMod.estado.id_estado == 3
    ) {
      await notifyInscritosSuspensionReuniones(meetingUpdated, id);
    }
    if (errorMeeting) return handleErrorClient(res, 400, errorMeeting);
    await notifyInscritosReuniones(meetingUpdated, id);
    handleSuccess(
      res,
      200,
      "La reunion fue modificada exitosamente",
      meetingUpdated,
    );
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteMeeting(req, res) {
  try {
    const id = req.params.id;
    const reunion = await getMeetingService(id);
    await notifyInscritosDeleteReuniones(reunion, id);
    const [meetingDelete, errorMeeting] = await deleteMeetingService(id);

    if (errorMeeting)
      return handleErrorClient(
        res,
        404,
        "Error eliminando la reunion",
        errorMeeting,
      );
    handleSuccess(res, 200, "Reunion eliminada correctamente", meetingDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function subirActaReunion(req, res) {
  try {
    const meetingRepository = AppDataSource.getRepository("Reunion");
    const idReunion = req.params.id;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo." });
    }
    const reunion = await meetingRepository.findOneBy({
      id_reunion: parseInt(idReunion),
    });
    if (!reunion) {
      return res.status(404).json({ message: "Reunión no encontrada." });
    }
    reunion.acta_pdf = `/uploads/actas/${file.filename}`;
    await meetingRepository.save(reunion);

    return res
      .status(200)
      .json({ message: "Acta subida correctamente.", reunion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al subir el acta." });
  }
}
