export type RegisterState = {
  errors?: {
    username?: string[]
    realname?: string[]
    email?: string[]
    id?: string[]
    pass1?: string[]
    pass2?: string[]
  }
  message: string | null
}

export type LoginState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message: string | null
}