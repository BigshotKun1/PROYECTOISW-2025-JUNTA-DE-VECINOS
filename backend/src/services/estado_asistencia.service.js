"use strict"
import { AppDataSource } from "../config/configDb.js"
import Estado from "../entity/EstadoAsistencia.js";

export async function createEstadoAsistenciaService(dataEstado){
    try {
        const estadoARepository = AppDataSource.getRepository(Estado);

        const nombre_estadoA = dataEstado.nombre_estado_asistencia

        const isRepeated = await estadoARepository
            .createQueryBuilder("e")
            .where(" e.nombre_estado_asistencia = :nombreEstado" , { nombreEstado: nombre_estadoA })
            .getOne()
    
        if(isRepeated!=null) return [null,"Ya existe un estado con este nombre"];
    
        const newEstado = estadoARepository.create({
            nombre_estado_asistencia: nombre_estadoA,
        });

        const estadoSaved = await estadoARepository.save(newEstado);
        return [estadoSaved,null];
        
    } catch (error) {
        console.error("Error al crear estado, el error es:", error);
    }
}
export async function getEstadoAsistenciaService(){
    try {
        const estadoARepository = AppDataSource.getRepository(Estado);

        const estados = await estadoARepository.find();

        if(!estados || estados.length === 0) return [null,"No se encontraron los estados"]
        
        return[estados,null];

    } catch (error) {
        console.error("Error al obtener estados de las asistencias, el error es:", error);
    }
}
export async function deleteEstadoAsistenciaService(data){
    try {
        const id = data.id
        const estadoARepository =  AppDataSource.getRepository(Estado);

        const estadoFound = await estadoARepository.findOne({
            where: {
                id_estado_asistencia : id
            }
        });
        if(!estadoFound) return [null, "no se encontro el estado"];

        console.log(estadoFound);
        const estadoDeleted =  await estadoARepository.remove(estadoFound);

        return [estadoDeleted, null];

    } catch (error) {
        console.error("Error al eliminar estado, el error es:", error);
    }
}