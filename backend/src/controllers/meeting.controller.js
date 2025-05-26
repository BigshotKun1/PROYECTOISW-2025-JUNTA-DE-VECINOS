"use strict";
import Meeting from "../entity/Reunion.js";
import { meetingBodyValidation } from "../validations/meeting.validation.js";
import {
    createMeetingService,
    deleteMeetingService,
    getMeetingService,
    getMeetingsService,
    updateMeetingService,
} from "../services/meeting.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js"
import { notifyVecinosReuniones } from "../services/email.service.js";

export async function createMeeting(req, res){  
    try {
        const newMeting = req.body;
        
        const { value , error } = meetingBodyValidation.validate(newMeting);
        
        if (error) return handleErrorClient(res,400,error.message);

        const [ meetingSaved, errorMeeting ] = await createMeetingService(value);
        console.log(errorMeeting)
        if(!meetingSaved) return handleErrorClient(res,400,errorMeeting);
        handleSuccess(res,200,"La reunion fue creada exitosamente",meetingSaved);
        await notifyVecinosReuniones(meetingSaved); 
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

export async function getMeeting(req, res){
    try {

        const  id = req.params.id

        console.log(id);

        const [ meeting , error]= await getMeetingService( id );

        if(error) return handleErrorClient(res,400,error);

        handleSuccess(res,200,"La reunion fue obtenida exitosamente",meeting);

    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

export async function getMeetings(req, res){
    try {
        const  [meetings, error]  = await getMeetingsService();    
        console.log(meetings)
        if(!meetings) return handleErrorClient(res,400,error)

        handleSuccess(res,200,"Se obtuvieron las reuniones con exito",meetings)
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

export async function updateMeeting(req, res){
    try {
        
        const id = req.params.id;

        const newDataMeeting = req.body;
        
        const { value , error } = meetingBodyValidation.validate(newDataMeeting);

        if (error) return handleErrorClient(res,400,error.message);

        //const { value , error } = meetingIdValidation.validate(id);

        //if(error) return handleErrorClient(res,400,error.message);

        const { meetingUpdated , errorMeeting } = await updateMeetingService(id,value);

        if(errorMeeting) return handleErrorClient(res,400,errorMeeting);

        //console.log(meetingUpdated);

        handleSuccess(res,200,"La reunion fue modificada exitosamente",meetingUpdated);

    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

export async function deleteMeeting(req, res){
    try {
        const id = req.params.id;

        const [ meetingDelete, errorMeeting ] = await deleteMeetingService(id);
        if (errorMeeting) return handleErrorClient(res, 404, "Error eliminando la reunion", errorMeeting);

        handleSuccess(res, 200, "Reunion eliminada correctamente", meetingDelete);

    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}