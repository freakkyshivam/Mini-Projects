
import {useState} from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import { z} from 'zod'

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

 import {Eye, EyeOff,UserPlus} from 'lucide-react'
 import { useNavigate } from 'react-router-dom';
 const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

 type signupFormData = z.infer<typeof signupSchema>;

const RegisterPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState : {errors, isSubmitting}
    } = useForm<signupFormData>({resolver:zodResolver(signupSchema)})

   const onSubmit = (data: signupFormData) => {
        console.log(data);

    }

  return (
     <section  className="min-h-screen flex flex-col items-center justify-center  p-4" id='register'>
        
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <Card className='w-[400px]'>
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
             className={`${errors.name ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600` }
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`${errors.email ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600` }
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
               className={`${errors.password ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600` }
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
            className="w-full bg-green-600" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
        </div>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
          onClick={()=>navigate('/login')}
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