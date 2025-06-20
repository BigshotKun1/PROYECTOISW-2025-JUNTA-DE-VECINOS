"use strict"
import Inscripcion from "../entity/Inscripcion_Reunion.js";
import Asistencia from "../entity/Asistencia_Reunion.js"
import Estado from "../entity/Estado.js";
import { AppDataSource } from "../config/configDb.js";
import { application } from "express";
import {
    createAsistenciasService,
    deleteAsistenciaService,
} from "../services/asistencia_reunion.service.js";

export async function createInscripcionService(dataInscripcion){
    try {

        const inscripcionRepository =  AppDataSource.getRepository(Inscripcion);
        //console.log("data inscripcion(service)",dataInscripcion)
        const newInscripcion = inscripcionRepository.create({
            id_usuario: dataInscripcion.id_usuario,
            id_reunion: dataInscripcion.id_reunion
        });
        //console.log("nueva inscripcion",newInscripcion)

        const inscripcionSaved = await inscripcionRepository.save(newInscripcion);
        //console.log("inscripcion guardada",inscripcionSaved)
        const asistencia = createAsistenciasService(inscripcionSaved.id_inscripcion_reunion);
        if(!asistencia) return [null,error];
        
/*
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);

        const estadoRepository = AppDataSource.getRepository(Estado);
        const estado = await estadoRepository
            .createQueryBuilder("e")
            .where("e.nombreEstado = :ausente",{ ausente: "Ausente" })
            .getOne();

        const newAsistencia = asistenciaRepository.create({
            id_inscripcion_reunion: inscripcionSaved.id_inscripcion_reunion,
            estado_asistencia : { id_estado_asistencia : 1 }
        })

        await asistenciaRepository.save(newAsistencia);
*/
        return [inscripcionSaved,null];
    
    } catch (error) {

        console.error("Error al inscribirse, el error es:", error);
    
    }
}
export async function getInscripcionesService(){
    try {
        const inscripcionRepository =  AppDataSource.getRepository(Inscripcion);

        const inscripciones = await inscripcionRepository.find();
    
        if(!inscripciones || inscripciones.length === 0 ) return [null,"No hay inscripciones"];
        //console.log("inscripciones(service):", inscripciones);
        return [inscripciones,null];
    } catch (error) {
        
        console.error("Error al obtener inscripciones, el error es:", error);
    
    }
}
export async function deleteInscripcionService(id){
    try {
        const inscripcionRepository =  AppDataSource.getRepository(Inscripcion);

        const inscripcionFound = await inscripcionRepository.findOne({
            where: {
                id_inscripcion_reunion : id
            }
        });
        if(!inscripcionFound) return [null, "no se encontro la inscripcion"];

        deleteAsistenciaService(inscripcionFound.id_inscripcion_reunion);
/*
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);

        const asistenciaFound = await asistenciaRepository.findOne({
            where: { id_inscripcion_reunion: inscripcionFound.id_inscripcion_reunion }
        })

        await asistenciaRepository.remove(asistenciaFound);*/
        //console.log(inscripcionFound);
        const inscripcionDeleted =  await inscripcionRepository.remove(inscripcionFound);
/*
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);

        const asistenciaFound = asistenciaRepository.findOne({
            where: { id_inscripcion_reunion: inscripcionFound.id_inscripcion_reunion }
        })

        await asistenciaRepository.remove(asistenciaFound);
*/
        return [inscripcionDeleted, null];

    } catch (error) {

        console.error("Error al  eliminar inscripcion, el error es:", error);
    
    }
}