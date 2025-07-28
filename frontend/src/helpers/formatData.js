import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatUserData(user) {
    return {
        ...user,
        nombreCompleto: startCase(user.nombreCompleto),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}

export function formatDirectivaData(directivaMiembro) {
  return {
    ...directivaMiembro,
    nombreCompleto: directivaMiembro.usuario?.nombreCompleto || '-',
    rut: directivaMiembro.usuario?.rut || '-',
    nombreRol: directivaMiembro.rol?.nombreRol || '-',
    fechaInicio: directivaMiembro.periodo?.fechaInicio || '-',
    fechaTermino: directivaMiembro.periodo?.fechaTermino || '-',
    // Formatea fechas si quieres con alguna librería tipo dayjs/moment
    createdAt: directivaMiembro.createdAt ? formatTempo(directivaMiembro.createdAt, "DD-MM-YYYY") : '-',
  };
}





export function convertirMinusculas(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].toLowerCase();
        }
    }
    return obj;
}

export function formatPostUpdate(user) {
    return {
        nombreCompleto: startCase(user.nombreCompleto),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        email: user.email,
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}