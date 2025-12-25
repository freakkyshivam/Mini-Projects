 import type {APIResponse, LoginSuccessResponse, LoginErrorResponse } from '@/types/types';
import axios,{AxiosError} from 'axios'
 
 

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});


export const loginApi = async (email:string, password:string):Promise<LoginResponse>=>{
      try {
        const {data} = await api.post(`/api/auth/login`,{
          email ,
          password
        })

        return data;
      } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    
    };
  }
}
 



export const signupApi = async (
  name: string,
  email: string,
  password: string
):Promise<APIResponse> => {
  try {
    const { data } = await api.post(`/api/auth/register`,
      { name, email, password }
    );

    return data;
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
      data : null
    };
  }
};


export const verifyRegistrationOtpApi = async(
  email :string, 
  otp : string,
):Promise<APIResponse>=>{
  try {

   const { data } = await api.post(
      `/api/auth/verify-register-otp`,
      {email,otp },
       
    );
    
    return data;
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
      data : null
    };
  }
}
