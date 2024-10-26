import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Email is required!').email('Email invalid!'),
  password: z.string().trim().min(1, 'Password is required!')
})



export type TSignInSchema = z.infer<typeof signInSchema>
