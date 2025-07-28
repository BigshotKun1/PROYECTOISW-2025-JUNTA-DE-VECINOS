import Swal from "sweetalert2";

export async function deleteDataAlert() {
  return Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!",
  });
}

export const showSuccessAlert = (titleMessage, message) => {
  Swal.fire(titleMessage, message, "success");
};

export const showErrorAlert = (titleMessage, message) => {
  Swal.fire(titleMessage, message, "error");
};

export async function modifyDataAlert() {
  return Swal.fire({
    title: "¿Deseas modificar los datos?",
    text: "Se actualizará la información actual.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, modificar",
    cancelButtonText: "Cancelar",
  });
}
