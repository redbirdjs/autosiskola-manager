export interface ReminderProps {
  url: string;
}

export interface RegistrationProps {
  username: string;
  realname: string;
  passport: string;
  url: string;
}

export interface NewLoginProps {
  address: string;
  userAgent: string;
}

export interface UserAddedProps {
  username: string;
  password: string;
}