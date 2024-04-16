export type RegisterState = {
  errors?: {
    username?: string[]
    realname?: string[]
    email?: string[]
    id?: string[]
    pass1?: string[]
    pass2?: string[]
  }
  message?: {
    title?: string | undefined
    description?: string
  }
}

export type LoginState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: {
    title?: string
    description?: string
  }
}

export type PasswordReminderState = {
  errors?: {
    email?: string[]
  }
  message?: {
    title?: string
    description?: string
  }
}

export type AlertMessageObject = {
  title?: string
  description?: string
}

export type UserState = {
  errors?: {
    username?: string[]
    realname?: string[]
    email?: string[]
    passport?: string[]
    rankId?: string[]
  }
  message?: {
    title?: string | undefined
    description?: string
  }
}

export type VehicleState = {
  errors?: {
    brand?: string[]
    type?: string[]
    plate?: string[]
    category?: string[]
    color?: string[]
    drivetype?: string[]
  }
  message?: {
    title?: string | undefined
    description?: string
  }
}

export type PaymentState = {
  errors?: {
    courseId?: string[]
    description?: string[]
    amount?: string[]
    due?: string[]
  }
  message?: {
    title?: string | undefined
    description?: string
  }
}

export type ExamState = {
  errors?: {
    courseId?: string[]
    description?: string[]
    date?: string[]
  }
  message?: {
    title?: string | undefined
    description?: string
  }
}

export type CourseState = {
  errors?: {
    categoryId?: string[]
    student?: string[]
    teacher?: string[]
    vehicle?: string[]
  },
  message?: {
    title?: string | undefined
    description?: string
  }
}

export type AvatarState = {
  errors?: {
    avatar?: string[]
  }
  message?: {
    title?: string | undefined
    description?: string
  }
}

export type EmailState = {
  errors?: {
    email?: string[]
  }
  message?: {
    title?: string | undefined
    description?: string
  }
}

export type PasswordState = {
  errors?: {
    oldpass?: string[]
    newpass1?: string[]
    newpass2?: string[]
  }
  message?: {
    title?: string | undefined
    description?: string
  }
}

export interface UserData {
  path: string;
  realname: string;
  username: string;
  email: string;
  rank: string;
}

export interface FullUserData {
  id: number;
  realname: string;
  username: string;
  email: string;
  avatarPath: string;
  rank: string;
}

export interface VehicleData {
  path: string;
  brand: string;
  type: string;
  plate: string;
  color: string | null;
  drivetype: string;
  category: string;
}

export interface CategoryName {
  id: number,
  category: string
}

export interface Payment {
  id: number;
  description: string;
  student: string;
  issuer: string;
  amount: number;
  state: number;
  created: Date;
  due: Date;
}

export interface Exam {
  id: number;
  date: Date;
  category: string;
  student: string;
  description: string;
  state: number;
}

export interface StudentFormData {
  id: number;
  category: string;
  student: {
    realname: string;
  }
}

export interface CategoryData {
  id: number;
  name: string;
}

export interface TeacherData {
  id: number;
  realName: string;
}

export interface VehicleEnrollData {
  id: number;
  brand: string;
  type: string;
  driveType: string;
}