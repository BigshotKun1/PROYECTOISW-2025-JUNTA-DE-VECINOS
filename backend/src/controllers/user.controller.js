"use strict";
import {
  createUserService,
  deleteUserService,
  getUserService,
  getUsersService,
  updateUserService,
} from "../services/user.service.js";
import {
  userBodyValidation,
  userQueryValidation,
} from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDb.js";

export async function createUser(req, res) {
  try {
    const { body } = req;

    const { error } = userBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, error.message);

    const [user, errorUser] = await createUserService(body);

    if (errorUser) return handleErrorClient(res, 400, errorUser);

    handleSuccess(res, 201, "Usuario creado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getUser(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error } = userQueryValidation.validate({ rut, id, email });

    if (error) return handleErrorClient(res, 400, error.message);

    const [user, errorUser] = await getUserService({ rut, id, email });

    if (errorUser) return handleErrorClient(res, 404, errorUser);

    handleSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getUsers(req, res) {
  try {
    const [users, errorUsers] = await getUsersService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    users.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateUser(req, res) {
  try {
    const { rut, id, email } = req.query;
    const { body } = req;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      id,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = userBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [user, userError] = await updateUserService({ rut, id, email }, body);

    if (userError)
      return handleErrorClient(
        res,
        400,
        "Error modificando al usuario",
        userError,
      );

    handleSuccess(res, 200, "Usuario modificado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      id,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [userDelete, errorUserDelete] = await deleteUserService({
      rut,
      id,
      email,
    });

    if (errorUserDelete)
      return handleErrorClient(
        res,
        404,
        "Error eliminado al usuario",
        errorUserDelete,
      );

    handleSuccess(res, 200, "Usuario eliminado correctamente", userDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function subirCertificadoResidencia(req, res) {
  const userRepository = AppDataSource.getRepository("User");
  const rutUser = req.params.rut;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No se ha subido ningún archivo." });
  }

  try {
    const user = await userRepository.findOneBy({
      rut: rutUser,
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    user.certificadoResidencia_pdf = `/uploads/certificadosResidencia/${file.filename}`;
    await userRepository.save(user);

    return res.status(200).json({
      message: "Certificado de Residencia subido correctamente.",
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al subir Certificado de Residencia." });
  }
}
