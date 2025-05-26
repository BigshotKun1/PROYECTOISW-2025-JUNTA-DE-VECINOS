"use strict"
import {
    getAsistenciasService,
    updateAsistenciaService
} from "../services/asistencia_reunion.service.js"
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js"
import { asistenciaBodyValidation } from "../validations/asistencia_reunion.validation.js"
export async function getAsistencias(req,res){
    try {

        const  id = req.params.id
        console.log(id)
        //const { value , error } = asistenciaBodyValidation.validate({ id });

        //if (error) return handleErrorClient(res,400,error.message);

        const [ listaAsistencia , errorLista] = await getAsistenciasService( id );
        
        if(errorLista) return handleErrorClient(res,400,errorLista);

        handleSuccess(res,200,"La lista de asistencia fue obtenida exitosamente",listaAsistencia);

    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

export async function updateAsistencia(req,res){
    try {

        const id = req.params.id
        const data = req.body

        const [ asistencia , error] = await updateAsistenciaService( id,data );
        
        if(error) return handleErrorClient(res,400,error);
        
        handleSuccess(res,200,"La asistencia fue registrada exitosamente",asistencia);

    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

