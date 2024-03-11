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

export type AlertMessageObject = {
  title?: string
  description?: string
}