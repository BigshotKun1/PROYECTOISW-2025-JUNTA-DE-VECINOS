"use strict"
import {  handleErrorClient,handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { 
    createEstadoService,
    deleteEstadoService,
    getEstadoService
} from "../services/estado.service.js"
import { estadoAsistenciaParamsValidation } from "../validations/estado.validation.js";

export async function createEstado(req,res){
    try {

        const newEstado = req.body;
        
        const { error } = estadoBodyValidation.validate(newEstado);

        if(error) handleErrorClient(res,400,error.message);
        
        const [ estado , errorEstado ] = await createEstadoService(newEstado);
        console.log(errorEstado)
        if(errorEstado) return handleErrorClient(res,400,error.message)

        handleSuccess(res,200,"El estado fue creado exitosamente",estado);
    } catch (error) {
    
        handleErrorServer(res,500,error.message);
    }
}
export async function getEstado(req,res){
    try {
        const  [estados, error]  = await getEstadoService();    
        
        if(error!=null) return handleErrorClient(res,400,error.message)

        handleSuccess(res,200,"Se obtuvieron los estados con exito",estados)
    
    } catch (error) {
    handleErrorServer(res,500,error.message);
    }
}
export async function deleteEstado(req,res){
    try {

        const id = req.params.id;
        const { error: idError } =estadoParamsValidation.validate({ id })
        if(idError) return handleErrorClient(res,400,idError.message)
        const [ estadoDelete, error ] = await deleteEstadoService(id);
        if(error) return handleErrorClient(res, 404, "Error eliminando la reunion", error);
        
        handleSuccess(res, 200, "Reunion eliminada correctamente", estadoDelete);
        
    
    } catch (error) {
    handleErrorServer(res,500,error.message);
    }
}