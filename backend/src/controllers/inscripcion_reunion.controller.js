"use strict"
import {
    createInscripcionService,
    deleteInscripcionService,
    getInscripcionesService,
} from "../services/inscripcion_reunion.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js"

export async function createInscripcion(req,res){
    try {
        
                const newInscripcion = req.body;
                //console.log(newInscripcion)
                //const { value , error } = estadoBodyValidation.validate(newEstado);
        
               // if(error) handleErrorClient(res,400,error.message);
                
                const [ inscripcion , errorInscripcion ] = await createInscripcionService(newInscripcion);
                //console.log(errorInscripcion)
                if(errorInscripcion != null) return handleErrorClient(res,400,error.message)
        
                handleSuccess(res,200,"Inscrito correctamente",inscripcion);
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }

}
export async function getInscripciones(req,res){
    try {
        const  [inscripciones, error]  = await getInscripcionesService();    
                //console.log(meetings)
        if(!inscripciones) return handleErrorClient(res,400,error)
        
        handleSuccess(res,200,"Se obtuvieron las inscripciones con exito",inscripciones)
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }

}
export async function deleteInscripcion(req,res){
    try {
            const id = req.params.id;
                
            const [ inscripcionDelete, error ] = await deleteInscripcionService(id);
            if(error) return handleErrorClient(res, 404, "Error eliminando la inscripcion", error);
                
            handleSuccess(res, 200, "Inscripcion eliminada correctamente", inscripcionDelete);
                
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }

}