"use stricts";
export async function onTime(fechaReunion) {
  if (typeof fechaReunion === "string") {
    const [anio, mes, dia] = fechaReunion.split("-");
    return `${dia}-${mes}-${anio}`;
  } else if (fechaReunion instanceof Date) {
    const dia = String(fechaReunion.getDate()).padStart(2, "0");
    const mes = String(fechaReunion.getMonth() + 1).padStart(2, "0");
    const anio = fechaReunion.getFullYear();
    return `${dia}-${mes}-${anio}`;
  } else {
    throw new Error("❌ fechaReunion no es un string ni un objeto Date válido");
  }
}
