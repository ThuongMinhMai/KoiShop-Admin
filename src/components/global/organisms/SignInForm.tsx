import { Button } from '../atoms/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TSignInSchema, signInSchema } from '@/components/Schema/LoginSchema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../atoms/ui/form'
import { Input } from '../atoms/ui/input'
import googleIcon from '@/assets/google.svg'
import { Link, useNavigate } from 'react-router-dom'
import { Shell } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../atoms/ui/use-toast'
import background from '@/assets/background.jpg'
import Icon from '@/assets/logo.jpg'
import Logo from '@/assets/logo.jpg'
import { useAuth } from '@/auth/AuthProvider'
import { Fish } from 'lucide-react'

import { Loader } from 'lucide-react'
function SignInForm() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggingGoogle, setIsLoggingGoogle] = useState(false)

  async function onSubmit(values: TSignInSchema) {
    // console.log('value loig', values)
    // setIsSubmitting(true)
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      await login(values.email, values.password)

      // navigate("/home")
      // console.log('vo ne')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const messageError = error.response.data.message
      toast({
        variant: 'destructive',
        description: messageError || 'The cause is unknown',
        title: 'Login error'
      })
      if (messageError === 'Email chưa được xác thực.') {
        navigate(`/auth/${error.response.data.userId}/verify-email?email=${error.response.data.email}`)
      }
      setIsSubmitting(false)
    }
  }

  return (
    <main className=''>
      <div className='container relative grid flex-col items-center justify-center min-h-screen lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex '>
          <div
            style={{
              backgroundImage: `url(${background})`
            }}
            className='absolute inset-0 bg-left-top bg-cover'
          />
          {/* <div className='relative z-20 flex items-center text-lg font-medium'>
          <img alt='logo' className='h-16' src={Logo} />
        </div> */}
        </div>
        <div className='py-4 lg:p-8'>
          <div className='py-4 lg:p-8'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
              <div className='flex flex-col space-y-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight'>Sign In</h1>
                <p className='text-sm flex justify-center items-center gap-2 text-muted-foreground'>
                  to continue with <Fish className='text-primary' />
                  Koi Shop
                </p>
              </div>
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter email ...' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type='password' placeholder='Enter password ...' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button disabled={loading} type='submit' className='w-full text-white'>
                      {loading && <Loader className='w-4 h-4 animate-spin' />} Sign in
                    </Button>
                  </form>
                </Form>
              </>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default SignInForm
