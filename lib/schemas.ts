import { z } from 'zod'

export const RegisterSchema = z.object({
  username: z.string().min(1, 'This field is required!').min(5, 'Username must be 5 characters long minimum!'),
  realname: z.string().min(1, 'This field is required!'),
  email: z.string().min(1, 'This field is required!').email({ message: 'Invalid email format!' }),
  passport: z.string().min(1, 'This field is required!').regex(/^[A-Z0-9]{8,9}$/, 'Invalid passport number!'),
  pass1: z.string().min(1, 'This field is required!').min(8, 'The password must be at least 8 characters long.'),
  pass2: z.string().min(1, 'This field is required!'),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format!' }),
  password: z.string().min(8),
});