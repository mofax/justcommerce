import * as z from 'zod'

const ZodEmailPassword = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export { ZodEmailPassword }
