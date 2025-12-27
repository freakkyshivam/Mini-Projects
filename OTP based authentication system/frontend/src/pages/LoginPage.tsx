import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card'

import { Eye, EyeOff,LogIn } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import {toast, ToastContainer} from 'react-toastify'
import { loginApi } from '@/api/authApi';
 import { useAuth } from '@/auth/useAuth';

const loginSchema = z.object({
    email: z.string().email("Invaild email"),
    password: z.string().min(8, 'Minimum 8 character')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {

    const [showPassword, setShowPassword] = useState(false)
   const {setUser} = useAuth();

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

    const onSubmit = async (d: LoginFormData) => {
  try {
    const data = await loginApi(d.email, d.password);

    if (!data.success) {
      toast.error(data.msg);
      return;
    }

    if (!data.user) {
      toast.error("Login failed: user data missing");
      return;
    }

    toast.success(`Welcome back ${data.user.name}`);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard");
  } catch (error) {
    toast.error("Something went wrong. Try again.");
    console.error(error)
  }
};


    return (
      
        <section  className="min-h-screen flex flex-col items-center justify-center  p-4" id="login">
          <ToastContainer/>
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
            <Card className="w-95">
             
                 <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <LogIn className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
        </div>
                    <CardDescription>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button 
            onClick={handleSubmit(onSubmit)} 
            className="w-full bg-blue-600" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={()=>navigate('/register')}   className="text-blue-600 hover:underline">
            Sign up
          </button>
        </p>
        <a href="#forgot" className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </a>
      </CardFooter>
            </Card>
        </section>
    )
}