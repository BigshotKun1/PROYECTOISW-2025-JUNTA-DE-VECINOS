"use strict";
import Meeting from "../entity/Reunion.js";
import Periodo from "../entity/DirectivaPeriodo.js";
import { AppDataSource } from "../config/configDb.js";
import formatToLocalTime from "../helpers/formatDate.js";


export async function createMeetingService(dataMeeting){
    try {
        const meetingRepository =  AppDataSource.getRepository(Meeting);
        const periodoRepository =  AppDataSource.getRepository(Periodo);

        const now = new Date();

        const periodo = await periodoRepository
            .createQueryBuilder("p")
            .where(":now BETWEEN p.fechaInicio AND p.fechaTermino",{ now })
            .getOne();

        /*    
        const { hora_inicio,hora_termino,fecha_reunion,lugar_reunion } = dataMeeting;
        const isRepeated = await meetingRepository.findOne({
            where: {
                hora_inicio : hora_inicio,
                hora_termino : hora_termino,
                fecha_reunion : fecha_reunion,
                lugar_reunion : lugar_reunion    
            }
        })
        const horaInicio = dataMeeting.hora_inicio
        const horaTermino = dataMeeting.hora_termino
        const fechaReunion = dataMeeting.fecha_reunion*/

        const { hora_inicio,hora_termino, fecha_reunion, lugar_reunion } = dataMeeting;
        const isRepeated = await meetingRepository
            .createQueryBuilder("r")
            .where(" r.fecha_reunion = :fechaReunion" , { fechaReunion: fecha_reunion })
            .andWhere("r.hora_inicio = :horaInicio", { horaInicio: hora_inicio })
            .andWhere("r.hora_termino = :horaTermino", { horaTermino: hora_termino })
            .andWhere("r.lugar_reunion = :lugarReunion", { lugarReunion:lugar_reunion })
            .getOne();

        if(isRepeated) return [null,"Ya existe una reunion con esas propiedades."]

        const newMeeting = meetingRepository.create({
            fecha_reunion: dataMeeting.fecha_reunion,
            lugar_reunion: dataMeeting.lugar_reunion,
            hora_inicio: dataMeeting.hora_inicio,
            hora_termino: dataMeeting.hora_termino,
            periodo: { id_periodo : periodo.id_periodo },
            estado: { id_estado : 1 }
        });

        const meetingSaved = await meetingRepository.save(newMeeting);

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

    const meetings = await meetingRepository.find();
    
    if(!meetings || meetings.length === 0 ) return [null,"No hay reuniones"];
    console.log("meetings de service:", meetings);
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

        const { horaInicio, horaTermino, fechaReunion, lugarReunion } = dataMeeting;
        const isRepeated = await meetingRepository
            .createQueryBuilder("r")
            .where(" r.fecha_reunion = :fechaReunion" , { fechaReunion })
            .andWhere("r.hora_inicio = :horaInicio", { horaInicio })
            .andWhere("r.hora_termino = :horaTermino", { horaTermino })
            .andWhere("r.lugar_reunion = :lugarReunion", { lugarReunion })
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
            estado: { id_estado : dataMeeting.id_estado }
        };

        await meetingRepository.update(id,dataMeetingUpdated);

        const meeting = await meetingRepository.findOne({
            where: { id_reunion:id }
        })

        if(!meeting) return [null, "reunion no encontrada despues de actualizar. "];
        const { id_reunion, ...meetingData } = meeting;

        //meetingData.fecha_reunion = formatToLocalTime(meetingData.fecha_reunion);
        //console.log(meetingData);
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

        console.log(meetingFound);
        const meetingDeleted =  await meetingRepository.remove(meetingFound);


        return [meetingDeleted, null];

    } catch (error) {
        console.error("Error al eliminar reunion, el error es:", error);
    }
}