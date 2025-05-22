"use strict";
import Meeting from "../entity/Reunion.js";
import { AppDataSource } from "../config/configDb.js";
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

export async function createMeeting(req, res){  
    try {
        const newMeting = req.body;

        const { value , error } = meetingBodyValidation.validate(newMeting);

        if (error) return handleErrorClient(res,400,error.message);

        const { meetingSaved, errorMeeting } = await createMeetingService(value);

        if(errorMeeting) return handleErrorClient(res,400,errorMeeting);
        handleSuccess(res,200,"La reunion fue creada exitosamente",meetingSaved);
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

export async function getMeeting(req, res){
    try {
        
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

export async function getMeetings(req, res){
    try {
        
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

export async function updateMeeting(req, res){
    try {
        
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}

export async function deleteMeeting(req, res){
    try {
        
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}