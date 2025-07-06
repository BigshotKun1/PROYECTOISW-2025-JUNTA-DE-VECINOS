"use strict";
import Meeting from "../entity/Reunion.js";
import Asistencia from "../entity/Asistencia_Reunion.js"
import { onTime } from "../helpers/dateMeeting.helper.js";

import Periodo from "../entity/DirectivaPeriodo.js";
import { createAsistenciasService } from "./asistencia_reunion.service.js";
import { AppDataSource } from "../config/configDb.js";


export async function createMeetingService(dataMeeting){
    try {
        const meetingRepository =  AppDataSource.getRepository(Meeting);
        const periodoRepository =  AppDataSource.getRepository(Periodo);
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);
        const now = new Date();

        const periodo = await periodoRepository
            .createQueryBuilder("p")
            .where(":now BETWEEN p.fechaInicio AND p.fechaTermino",{ now })
            .getOne();

        const { hora_inicio,hora_termino, fecha_reunion, lugar_reunion, descripcion_reunion } = dataMeeting;
        
        const fechaReunion = new Date(dataMeeting.fecha_reunion);
        if (!onTime(fechaReunion)) {
            return [null, "La reunión debe agendarse con al menos 12 horas de anticipación."];
        }
        const isRepeated = await meetingRepository
            .createQueryBuilder("r")
            .where(" r.fecha_reunion = :fechaReunion" , { fechaReunion: fecha_reunion })
            .andWhere("r.hora_inicio = :horaInicio", { horaInicio: hora_inicio })
            .andWhere("r.hora_termino = :horaTermino", { horaTermino: hora_termino })
            .andWhere("r.lugar_reunion = :lugarReunion", { lugarReunion:lugar_reunion })
            .andWhere("r.descripcion_reunion = :descripcionReunion",{ descripcionReunion:descripcion_reunion })
            .getOne();

        if(isRepeated) return [null,"Ya existe una reunion con esas propiedades."]

        const newMeeting = meetingRepository.create({
            fecha_reunion: dataMeeting.fecha_reunion,
            lugar_reunion: dataMeeting.lugar_reunion,
            hora_inicio: dataMeeting.hora_inicio,
            hora_termino: dataMeeting.hora_termino,
            descripcion_reunion: dataMeeting.descripcion_reunion,
            periodo: { id_periodo : periodo.id_periodo },
            estado: { id_estado : 1 }
        });

        const meetingSaved = await meetingRepository.save(newMeeting);

        console.log("id de la reunion recien creada: ",meetingSaved.id_reunion)

        const listaAsistencia = await createAsistenciasService(meetingSaved.id_reunion);

        return [meetingSaved,null];

    } catch (error) {
        console.error("Error al crear reunion, el error es:", error);
    }
}

export async function getMeetingService(id){
    try {

        const meetingRepository = await AppDataSource.getRepository(Meeting);

        const meetingFound = await meetingRepository.findOne({
            where: { id_reunion : id }
        });

        if(!meetingFound) return [null,"No se encontro la reunion."]

        return [meetingFound,null] 
    } catch (error) {
        console.error("Error al obtener reunion, el error es:", error);
    }
}
export async function getMeetingsService(){
    try {
    const meetingRepository =  AppDataSource.getRepository(Meeting);

    const meetings = await meetingRepository.find({
        relations: ["estado"]
    });
    
    if(!meetings || meetings.length === 0 ) return [null,"No hay reuniones"];
    //console.log("meetings de service:", meetings);
    return [meetings,null];
    } catch (error) {
        console.error("Error al obtener reuniones, el error es:", error);
        return error
    }
}

export async function updateMeetingService(id,dataMeeting){
    try {
        const  meetingRepository = await AppDataSource.getRepository(Meeting);

        const meetingFound = meetingRepository.findOne({
            where: {
                id_reunion : id
            }
        });

        if(!meetingFound) return [null, "no se encontro la reunion"];

        const { horaInicio, horaTermino, fechaReunion, lugarReunion,descripcion_reunion } = dataMeeting;
        const fechaReunionAux = new Date(dataMeeting.fecha_reunion);
        if (!onTime(fechaReunionAux)) {
            return [null, "La reunión debe editarse con al menos 12 horas de anticipación."];
        }
        const isRepeated = await meetingRepository
            .createQueryBuilder("r")
            .where(" r.fecha_reunion = :fechaReunion" , { fechaReunion })
            .andWhere("r.hora_inicio = :horaInicio", { horaInicio })
            .andWhere("r.hora_termino = :horaTermino", { horaTermino })
            .andWhere("r.lugar_reunion = :lugarReunion", { lugarReunion })
            .andWhere("r.descripcion_reunion = :descripcionReunion",{ descripcionReunion:descripcion_reunion })
            .getOne();

        if(isRepeated){
            return {
                meetingSaved : null,
                errorMeting : "Ya existe una reunion con esas propiedades."
            };
        };

        const dataMeetingUpdated = {
            fecha_reunion : dataMeeting.fecha_reunion,
            hora_inicio : dataMeeting.hora_inicio,
            hora_termino : dataMeeting.hora_termino,
            lugar_reunion : dataMeeting.lugar_reunion,
            descripcion_reunion: dataMeeting.descripcion_reunion,
            estado: { id_estado : dataMeeting.id_estado }
        };

        await meetingRepository.update(id,dataMeetingUpdated);

        const meeting = await meetingRepository.findOne({
            where: { id_reunion:id }
        })

        if(!meeting) return [null, "reunion no encontrada despues de actualizar. "];
        const { id_reunion, ...meetingData } = meeting;
        return [ meetingData , null ]
    } catch (error) {   
    console.error("Error al modificar reunion, el error es:", error);
    }
}

export async function deleteMeetingService(id){
    try {

        const meetingRepository =  AppDataSource.getRepository(Meeting);

        const meetingFound = await meetingRepository.findOne({
            where: {
                id_reunion : id
            }
        });
        if(!meetingFound) return [null, "no se encontro la reunion"];
        
        const fechaReunionAux = new Date(meetingFound.fecha_reunion);
        if (!onTime(fechaReunionAux)) {
            return [null, "La reunión debe eliminarse con al menos 12 horas de anticipación."];
        }

        const asistenciasRepository = AppDataSource.getRepository(Asistencia);
        const asistencias = await asistenciasRepository.find({
            where: { id_reunion: id }
        });
        console.log("asistencias",asistencias)
        if (asistencias.length > 0) {
            await asistenciasRepository.remove(asistencias);
        }
        
        const meetingDeleted =  await meetingRepository.remove(meetingFound);

        return [meetingDeleted, null];

    } catch (error) {
        console.error("Error al eliminar reunion, el error es:", error);
    }
}