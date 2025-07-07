"use strict"

export function onTime(fechaReunion) {
    if (!fechaReunion) return false;
    const fecha = new Date(fechaReunion);
    const now = new Date();
    const diferencia = (fecha - now) / (1000 * 60 * 60);
    return diferencia >= 12;
}
