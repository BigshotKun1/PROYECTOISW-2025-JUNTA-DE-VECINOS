import { AppDataSource } from "../config/configDb.js";

export async function isDirectiva(req, res, next) {
  try {
    const miembroRepo = AppDataSource.getRepository("DirectivaMiembro");
    const periodoRepo = AppDataSource.getRepository("DirectivaPeriodo");
    const userId = req.user.id_usuario;

    const hoy = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD

    // Buscar si el usuario pertenece a un periodo vigente
    const miembroActivo = await miembroRepo
      .createQueryBuilder("miembro")
      .innerJoinAndSelect("miembro.periodo", "periodo")
      .where("miembro.id_usuario = :userId", { userId })
      .andWhere("periodo.fechaInicio <= :hoy", { hoy })
      .andWhere("periodo.fechaTermino >= :hoy", { hoy })
      .getOne();

    if (!miembroActivo) {
      return res.status(403).json({ message: "Acceso denegado: no es miembro activo de la directiva" });
    }

    // Puedes agregar más lógica si deseas validar roles específicos (presidente, etc.)
    req.directiva = miembroActivo;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
