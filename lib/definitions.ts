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

export interface UserData {
  path: string;
  realname: string;
  username: string;
  email: string;
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

export interface ExamStudentData {
  id: number;
  category: string;
  student: {
    realname: string;
  }
}