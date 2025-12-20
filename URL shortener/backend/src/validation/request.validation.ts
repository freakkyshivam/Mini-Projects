import {email, z} from 'zod'

export const signupBodySchema = z.object({
    firstName : z.string(),
    lastName : z.string().optional(),
    email : z.string().email(),
    password : z.string().min(8)
})

export const loginBodySchema = z.object({
    email : z.string().email(),
    password : z.string().min(8)
})

export const urlShortenBodySchema = z.object({
    url:z.string().url(),
    code : z.string().optional()
})