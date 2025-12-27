import { logoutApi } from "@/api/authApi";
export async function  logout() {
    await logoutApi()
  localStorage.clear();  
  window.location.href = "/login";
}
