import Swal from "sweetalert2";

function Toast() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: true,
    color: "red",
  });

  return Toast;
}

export default Toast;

export function ToastSuccess() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    color: "green",
    background: "#e6ffe6",
    iconColor: "green",
    icon: "success",
  });

  return Toast;
}
