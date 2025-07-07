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
import { asistenciaBodyValidation, asistenciaParamsValidation } from "../validations/asistencia_reunion.validation.js"
export async function getAsistencias(req,res){
    try {

        const  id = req.params.id
        console.log(id)
        const { error } = asistenciaParamsValidation.validate({ id });
        console.log("error de validación asistencia ",error)
        if (error) return handleErrorClient(res,400,error.message);
        
        const [ listaAsistencia , errorLista ] = await getAsistenciasService( id );
        console.log("error lista: ", errorLista)
        if(errorLista != null ) return handleErrorClient(res,400,errorLista);

        handleSuccess(res,200,"La lista de asistencia fue obtenida exitosamente",listaAsistencia);

    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

export async function updateAsistencia(req,res){
    try {

        const id = req.params.id
        const data = req.body
        const { error: idError } = asistenciaParamsValidation.validate({ id })
        console.log("idError:",idError)
        if(idError) return handleErrorClient(res,400,idError.message)
        const { error:bodyError } = asistenciaBodyValidation.validate( data );
        console.log("bodyError:",bodyError)
        if(bodyError) return handleErrorClient(res,400,bodyError.message)
        const [ asistencia , errorAsistencia] = await updateAsistenciaService( id,data );
        
        if(errorAsistencia) return handleErrorClient(res,400,errorAsistencia);
        
        handleSuccess(res,200,"La asistencia fue registrada exitosamente",asistencia);

    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

