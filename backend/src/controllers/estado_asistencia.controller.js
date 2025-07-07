"use strict"
import EstadoA from "../entity/Estado.js"
import {  handleErrorClient,handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { 
    createEstadoAsistenciaService,
    deleteEstadoAsistenciaService,
    getEstadoAsistenciaService
} from "../services/estado_asistencia.service.js"
import {
    estadoAsistenciaBodyValidation,
    estadoAsistenciaParamsValidation
} from "../validations/estado_asistencia.validation.js"
export async function createEstadoAsistencia(req,res){
    try {

        const newEstadoA = req.body;
        const { value , error } = estadoAsistenciaBodyValidation.validate(newEstadoA);
        console.log("error validar body en controller: ",error)
        if(error) handleErrorClient(res,400,error.message);
        
        const [ estadoA , errorEstado ] = await createEstadoAsistenciaService(value);
        
        if(errorEstado) return handleErrorClient(res,400,errorEstado.message)

        handleSuccess(res,200,"El estado fue creado exitosamente",estadoA);
    } catch (error) {
    
        handleErrorServer(res,500,error.message);
    }
}
export async function getEstadoAsistencia(req,res){
    try {

        const  [estadosA, errorEA]  = await getEstadoAsistenciaService();    
        
        if(errorEA != null) return handleErrorClient(res,400,error)

        handleSuccess(res,200,"Se obtuvieron los estados con exito",estadosA)
    
    } catch (error) {
    handleErrorServer(res,500,error.message);
    }
}
export async function deleteEstadoAsistencia(req,res){
    try {
        const id = req.params;
        const { error } = estadoAsistenciaParamsValidation.validate(id)
        console.log("error en deletecontroller",error)
        if(error) return handleErrorClient(res,400,error) 
        
        const [ estadoADelete, errorE ] = await deleteEstadoAsistenciaService(id);
        if(errorE) return handleErrorClient(res, 404, "Error eliminando el estado de asistencia", errorE);
        
        handleSuccess(res, 200, "Estado eliminado correctamente", estadoADelete);
        
    } catch (error) {
    handleErrorServer(res,500,error.message);
    }
}