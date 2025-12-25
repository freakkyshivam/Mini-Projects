
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
  CardFooter
} from '@/components/ui/card';

import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { signupApi, verifyRegistrationOtpApi } from '@/api/authApi';

import { toast } from 'react-toastify';

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const verifyOtpSchema = z.object({
  otp: z.string().trim().length(6, "OTP must be exactly 6 digits")
})


type signupFormData = z.infer<typeof signupSchema>;
type verifyOtpFormData = z.infer<typeof verifyOtpSchema>;

const RegisterPage = () => {
  
 const [showPassword, setShowPassword] = useState(false);
 const [step, setStep] = useState<'REGISTER' | 'OTP'>('REGISTER')
 const [email, setEmail] = useState<string>("")

  const navigate = useNavigate();

  const signupForm = useForm<signupFormData>({
  resolver: zodResolver(signupSchema)
})

const otpForm = useForm<verifyOtpFormData>({
  resolver: zodResolver(verifyOtpSchema)
})


  const onSubmit = async (values: signupFormData) => {
   
    const result = await signupApi(values.name, values.email, values.password);
    
    if (!result.success){
      toast.error(result.msg)
      return;
    }
      setEmail(values.email);
      toast.success(result.msg)
      setStep("OTP")
 ;
  }

 const verifyOtp = async (values: verifyOtpFormData) => {
  const result = await verifyRegistrationOtpApi(
    email,
    values.otp
  )

    if (!result.success){
      toast.error(result.msg)
      return;
    }

    toast.success(result.msg)
  navigate("/login")
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center  p-4" id='register'>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <Card className='w-100'>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
          </div>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>

      <CardContent>

        

          {step === "REGISTER" ? (
            <form action="" method="post" onSubmit={signupForm.handleSubmit(onSubmit)}>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...signupForm.register("name")}
                className={`${signupForm.formState.errors.name ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600`}
              />
              {signupForm.formState.errors.name && (
                <p className="text-red-500 text-sm">{signupForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...signupForm.register("email")}
                className={`${signupForm.formState.errors.email ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600`}
              />
              {signupForm.formState.errors.email && (
                <p className="text-red-500 text-sm">{signupForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
             
                  {...signupForm.register("password")}
                  className={`${signupForm.formState.errors.password ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600`}
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
              {signupForm.formState.errors.password && (
                <p className="text-red-500 text-sm">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

                <Button
              type='submit'
              disabled={signupForm.formState.isSubmitting }
              className={`w-full bg-green-600 ${(signupForm.formState.isSubmitting)
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
                }`}
            >
              {signupForm.formState.isSubmitting ? "Creating account..." : "Register"}
            </Button>
        
          </div>
          </form>
          )
          : (
            <form onSubmit={otpForm.handleSubmit(verifyOtp)} method="post" className='space-y-4'>
              <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                className={`${signupForm.formState.errors.email ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600`}
              />
              {signupForm.formState.errors.email && (
                <p className="text-red-500 text-sm">{signupForm.formState.errors.email.message}</p>
              )} 
            </div>

                 <div className="space-y-2 ">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                {...otpForm.register("otp")}
                className={`${otpForm.formState.errors.otp ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600`}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-red-500 text-sm">{otpForm.formState.errors.otp.message}</p>
              )}
            </div>

               <Button
              type='submit'
              disabled={otpForm.formState.isSubmitting }
              className={`w-full bg-green-600 ${(otpForm.formState.isSubmitting)
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
                }`}
            >
              {otpForm.formState.isSubmitting ? "Verifying OTP..." : "Verify OTP"}
            </Button>
            
            </form>
          )
        }

        </CardContent>
        

        <CardFooter>
          
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline">
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </section>
  )
}

export default RegisterPage