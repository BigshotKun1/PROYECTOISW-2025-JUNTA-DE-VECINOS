"use strict";
import Asistencia from "../entity/Asistencia_Reunion.js"
import { AppDataSource } from "../config/configDb.js";
import { application } from "express";
import Reunion from "../entity/Reunion.js"
//import Inscripcion from "../entity/Inscripcion_Reunion.js"

export async function getAsistenciasService(id){
    try {
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);
        console.log(id)
        const meetingRepository = AppDataSource.getRepository(Reunion);

        const meetingFound = meetingRepository.findOne({
            where: { id_reunion:id }
        })

        if(!meetingFound) return [null,"No se encontro la reunion."];

        const listaAsistencia = await AppDataSource.getRepository(Asistencia)
            .createQueryBuilder("a")
            .innerJoinAndSelect("a.id_inscripcion_reunion", "i")  
            .innerJoinAndSelect("i.id_usuario", "u")              
            .innerJoinAndSelect("a.id_estado", "e")               
            .where("i.id_reunion = :id_reunion", { id_reunion: id })
            .getMany();
        if(!listaAsistencia || listaAsistencia.lenght==0) return [null,"No se encontró lista de asistencia."];

        //console.log(listaAsistencia)
        return [listaAsistencia,null]

    } catch (error) {
        console.error("Error al obtener lista de asistencia, el error es:", error);
    }
}

export async function updateAsistenciaService(id,data){
    try {
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);

        const asistenciaFound = await asistenciaRepository.findOne({
            where: {
                id_asistencia_reunion : id
            }
        });
        //console.log(asistenciaFound)
        if(!asistenciaFound) return [null,"No se encontro el registro de asistencia."];

        asistenciaFound.id_estado = data.id_estado;

        const asistenciaActualizada = await asistenciaRepository.save(asistenciaFound);

        return [asistenciaActualizada, null];

    } catch (error) {
        console.error("Error al modificar  asistencia, el error es:", error);
    }
}