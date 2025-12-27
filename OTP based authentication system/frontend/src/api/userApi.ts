 import type { APIResponse, UserSession } from '@/types/types';
 import axios,{AxiosError} from 'axios'
 
 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

export const allSessions = async (): Promise<APIResponse<UserSession[]>> => {
  try {
    const { data } = await api.get<APIResponse<UserSession[]>>(
      "/api/user/sessions",
      { withCredentials: true }
    );
 
    
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data as APIResponse<UserSession[]>;
    }

    return {
      success: false,
      msg: "Something went wrong",
      data: undefined,
    };
  }
};
