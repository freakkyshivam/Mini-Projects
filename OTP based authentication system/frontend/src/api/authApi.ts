 import type {
  APIResponse, 
  LoginSuccessResponse, 
  LoginErrorResponse,
  signupResponse
 } from '@/types/types';
import axios,{AxiosError} from 'axios'
import {logout} from '@/utils/logout'
 
 

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials:true
});

api.interceptors.response.use( res=> res, async error=>{
    if(error.response?.status === 401){
      try {
        const {data} = await api.post("/api/auth/refresh-token" )
        console.log(data);
        
      } catch (error) {
        logout()
         window.location.href = "/login";
         console.log("Token refresh error ",error);
         
      }
    }
    return Promise.reject(error);
 }
 )

export const loginApi = async (email:string, password:string):Promise<LoginResponse>=>{
      try {
        const {data} = await api.post(`/api/auth/login`,{
          email ,
          password
        } )
        
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
):Promise<APIResponse<signupResponse>> => {
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
    };
  }
};


export const verifyRegistrationOtpApi = async(
  email :string, 
  otp : string,
):Promise<APIResponse<signupResponse>>=>{
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
    };
  }
}

export const logoutApi = async ()=>{
  try {
    const {data} = await api.post('/api/auth/logout',{})

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

 export const revokeSessionApi = async (sid : string)=>{
  try {
    const {data} = await api.post('/api/auth/revoke-session',{sid})

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