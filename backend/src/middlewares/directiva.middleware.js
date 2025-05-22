import { AppDataSource } from "../config/configDb.js";

export async function isDirectiva(req, res, next) {
  try {
    const directivaRepo = AppDataSource.getRepository("Directiva");
    const userId = req.user.id_usuario; // asegúrate que el token o sesión incluya esto

    // Buscar si el usuario tiene alguna directiva activa
    const directivaActiva = await directivaRepo
      .createQueryBuilder("d")
      .where("d.id_usuario = :userId", { userId })
      .andWhere("d.FechaInicio <= NOW()")
      .andWhere("d.FechaTermino >= NOW()")
      .getOne();

    if (!directivaActiva) {
      return res.status(403).json({ message: "Acceso denegado: no es miembro de la directiva" });
    }

    // Puedes pasar la directiva o rol al req para usar en los controladores si quieres
    req.directiva = directivaActiva;

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
