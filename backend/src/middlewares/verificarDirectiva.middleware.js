import User from "../entity/user.entity.js";
import rol from "../entity/rol.js"

const verificarDirectiva = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || !user.rol) {
      return res.status(403).json({
        message: "Acceso denegado. Usuario no autenticado o sin rol.",
      });
    }

    const userRole = await rol.findOne({ where: { id_rol: user.rol } });

    if (!userRole || userRole.nombre !== "administrador") {
      return res.status(403).json({
        message: "Acceso denegado. Se requiere un rol de administrador.",
      });
    }

    next();
  } catch (error) {
    console.error("Error en verificarDirectiva:", error);
    return res.status(500).json({
      message: "Error interno del servidor.",
    });
  }
}