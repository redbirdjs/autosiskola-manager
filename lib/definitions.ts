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