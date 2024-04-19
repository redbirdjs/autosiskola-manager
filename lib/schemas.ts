import { z } from 'zod'

export const RegisterSchema = z.object({
  username: z.string().min(1, 'This field is required!').min(5, 'Username must be 5 characters long minimum!'),
  realname: z.string().min(1, 'This field is required!'),
  email: z.string().min(1, 'This field is required!').email({ message: 'Invalid email format!' }),
  passport: z.string().min(1, 'This field is required!').regex(/^[A-Z0-9]{8,9}$/, 'Invalid passport number!'),
  pass1: z.string().min(1, 'This field is required!').min(8, 'The password must be at least 8 characters long!'),
  pass2: z.string().min(1, 'This field is required!'),
});

export const LoginSchema = z.object({
  email: z.string().min(1, 'This field is required!').email({ message: 'Invalid email format!' }),
  password: z.string().min(1, 'This field is required!'),
});

export const PasswordReminderSchema = z.object({
  email: z.string().min(1, 'This field is required!').email({ message: 'Invalid email format!' }),
});

export const ChangeForgottenPasswordSchema = z.object({
  passToken: z.string().min(1, 'The token is required for changing the password!'),
  pass1: z.string().min(1, 'This field is required!').min(8, 'The password must be at least 8 characters long!'),
  pass2: z.string().min(1, 'This field is required!')
});

export const UserSchema = z.object({
  username: z.string().min(1, 'Username field is required!'),
  realname: z.string().min(1, 'Real name field is required!'),
  email: z.string().min(1, 'Email field is required!').email('Invalid email format!'),
  passport: z.string().min(1, 'Passport field is required!').regex(/^[A-Z0-9]{8,9}$/, 'Invalid passport format!'),
  rankId: z.number({ invalid_type_error: 'Rank ID must be a number!' })
});

export const VehicleSchema = z.object({
  brand: z.string().min(1, 'Brand field is required!'),
  type: z.string().min(1, 'Type field is required!'),
  plate: z.string().min(1, 'Plate field is required!'),
  category: z.number({ invalid_type_error: 'Category must be a number' }),
  color: z.string().min(1, 'Color field is required!'),
  drivetype: z.string().min(1, 'Drive type field is required!'),
  image: z.instanceof(File).refine((file) => file.size <= 5249494, 'Max image size is 5MB.').optional()
});

export const PaymentSchema = z.object({
  courseId: z.number().min(1, 'Student field is required!'),
  description: z.string().min(1, 'Description field is required!'),
  amount: z.number().min(0, 'Amount field is required!').max(10000, 'The maximum amount is $10000'),
  due: z.date().min(new Date(Date.now()), 'You must specify a future date!')
});

export const ExamSchema = z.object({
  courseId: z.number().min(1, 'Student field is required!'),
  description: z.string().min(1, 'Description field is required!'),
  date: z.date().min(new Date(Date.now()), 'You must specify a future date!')
});

export const CourseSchema = z.object({
  categoryId: z.number().min(1, 'Category field is required!'),
  student: z.number({ invalid_type_error: 'Student ID is required for enrollment!' }),
  teacher: z.number({ invalid_type_error: 'You have to choose a teacher!' }),
  vehicle: z.number({ invalid_type_error: 'You have to choose a vehicle!' })
});

export const AvatarSchema = z.object({
  userId: z.number({ invalid_type_error: 'User ID must be a number!' }),
  avatar: z.instanceof(File).refine((file) => file.size <= 5249494, 'Max image size is 5MB.')
});

export const EmailSchema = z.object({
  userId: z.number({ invalid_type_error: 'User ID must be a number!' }),
  email: z.string().email().min(1, 'This field is required!')
});

export const ChangePasswordSchema = z.object({
  userId: z.number({ invalid_type_error: 'User ID must be a number!' }),
  oldpass: z.string().min(1, 'This field is required!'),
  newpass1: z.string().min(1, 'This field is required!'),
  newpass2: z.string().min(1, 'This field is required!')
});

export const newEventSchema = z.object({
  userId: z.number({ invalid_type_error: 'User ID must be a number!' }),
  date: z.date().min(new Date(Date.now()), 'You must specify a future date!'),
  title: z.string().min(1, 'Title field is required!'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-f]{6}$/, 'Invalid HEX format! (ex: #ff0000)').optional()
})