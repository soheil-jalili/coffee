import swal from "sweetalert";

export const showSwal = async (
  title: string,
  icon: "success" | "warning" | "error" | "info" | "question" | undefined,
  buttons: string | string[]
) => {
  const result = await swal({
    title,
    icon,
    buttons
  });

  return result;
};
