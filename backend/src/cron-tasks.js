import { AppDataSource } from "./config/configDb.js"
import cron from "node-cron";
import DirectivaMiembro from "./entity/DirectivaMiembros.js";
import  User  from "./entity/user.entity.js";
import  Rol  from "./entity/rol.js";

cron.schedule("* * * * *", async () => {
  console.log("⏰ Ejecutando tarea para revisar directivas expiradas...");
  const today = new Date();

  try {
    const miembros = await AppDataSource.getRepository(DirectivaMiembro).find({
  relations: ["periodo", "usuario", "usuario.rol"],
  
});
  console.log("Miembros de la directiva encontrados:", miembros);


    for (const miembro of miembros) {
      const { periodo, usuario } = miembro;

      if (new Date(periodo.fechaTermino) < today && usuario.id_rol.nombreRol !== "Vecino") {
        const vecinoRol = await AppDataSource.getRepository(Rol).findOne({
          where: { nombreRol: "Vecino" },
        });
        console.log("vecinorol1:", vecinoRol);

        usuario.id_rol = vecinoRol.id_rol;
        usuario.rol = vecinoRol; // si quieres mantener la relación cargada en memoria también
        console.log("Usuario igualado:", usuario.id_rol);
        await AppDataSource.getRepository(User).save(usuario);
        console.log(`✔ Usuario ${usuario.nombreCompleto} degradado a Vecino.`);
        

      }
    }
  } catch (error) {
    console.error("❌ Error en tarea cron:", error.message);
  }
});
