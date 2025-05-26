"use strict"
import { AppDataSource } from "../config/configDb.js"
import Estado from "../entity/Estado.js";

export async function createEstadoService(dataEstado){
    try {
        const estadoRepository = AppDataSource.getRepository(Estado);

        const nombre_estado = dataEstado.nombre_estado

        const isRepeated = await estadoRepository
            .createQueryBuilder("e")
            .where(" e.nombreEstado = :nombreEstado" , { nombreEstado: nombre_estado })
            .getOne()
    
        if(isRepeated!=null) return [null,"Ya existe un estado con este nombre"];
    
        const newEstado = estadoRepository.create({
            nombreEstado: nombre_estado,
        });

        const estadoSaved = await estadoRepository.save(newEstado);
        return [estadoSaved,null];
        
    } catch (error) {
        console.error("Error al crear estado, el error es:", error);
    }
}
export async function getEstadoService(){
    try {
        const estadoRepository = AppDataSource.getRepository(Estado);

        const estados = await estadoRepository.find();

        if(!estados || estados.length === 0) return [null,"No se encontraron los estados"]
        
        return[estados,null];

    } catch (error) {
        console.error("Error al obtener estados de reuniones, el error es:", error);
    }
}
export async function deleteEstadoService(id){
    try {
        const estadoRepository =  AppDataSource.getRepository(Estado);

        const estadoFound = await estadoRepository.findOne({
            where: {
                id_estado : id
            }
        });
        if(!estadoFound) return [null, "no se encontro el estado"];

        console.log(estadoFound);
        const estadoDeleted =  await estadoRepository.remove(estadoFound);

        return [estadoDeleted, null];

    } catch (error) {
        console.error("Error al eliminar estado, el error es:", error);
    }
}