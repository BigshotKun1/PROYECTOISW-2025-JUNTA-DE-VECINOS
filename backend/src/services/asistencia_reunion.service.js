"use strict";
import Asistencia from "../entity/Asistencia_Reunion.js"
import { AppDataSource } from "../config/configDb.js";
//import { application } from "express";
import Reunion from "../entity/Reunion.js"
//import Inscripcion from "../entity/Inscripcion_Reunion.js"


export async function createAsistenciasService(id){
    try {
            console.log(id)
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);

        const newAsistencia = asistenciaRepository.create({
            id_inscripcion_reunion:id,
            id_estado_asistencia :  1 
        })
        console.log("asistencia createService",newAsistencia);
        if(!newAsistencia) return "Error al inscribirse";
        
        await asistenciaRepository.save(newAsistencia);
        return [newAsistencia,null]
    } catch (error) {
        console.error("Error al crear lista de asistencia, el error es:", error);
    }
}

export async function getAsistenciasService(id){
    try {
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);
        console.log(id)
        const meetingRepository = AppDataSource.getRepository(Reunion);

        const meetingFound = meetingRepository.findOne({
            where: { id_reunion:id }
        })

        if(!meetingFound) return [null,"No se encontro la reunion."];

        const listaAsistencia = await asistenciaRepository
            .createQueryBuilder("a")
            .innerJoinAndSelect("a.id_inscripcion_reunion", "i")  
            .innerJoinAndSelect("i.id_usuario", "u")              
            .innerJoinAndSelect("a.id_estado_asistencia", "e")               
            .where("i.id_reunion = :id_reunion", { id_reunion: id })
            .getMany();
        console.log(listaAsistencia.length)

        if(!listaAsistencia || listaAsistencia.length==0) return [ null , "No hay inscritos." ];

        //console.log(listaAsistencia)
        return [ listaAsistencia , null ]

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

        asistenciaFound.id_estado_asistencia = data.id_estado_asistencia;
        console.log(asistenciaFound)
        const asistenciaActualizada = await asistenciaRepository.save(asistenciaFound);

        return [asistenciaActualizada, null];

    } catch (error) {
        console.error("Error al modificar  asistencia, el error es:", error);
    }
}

export async function deleteAsistenciaService(id){
    try {
        
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);

        const asistenciaFound = await asistenciaRepository.findOne({
            where: { id_inscripcion_reunion: id }
        })

        await asistenciaRepository.remove(asistenciaFound);
    } catch (error) {
        console.error("Error al eliminar  asistencia, el error es:", error);
    }
}