import { ElMessage } from "element-plus";

export default function showError(message) {
  ElMessage({
    showClose: true,
    message,
    type: "error",
    duration: 20000,
  });
}
