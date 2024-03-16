import { Resend } from 'resend'

const resendClientSignleton = () => {
  return new Resend(process.env.RESEND_KEY);
}

declare global {
  var resendGlobal: undefined | ReturnType<typeof resendClientSignleton>
}

const resend = globalThis.resendGlobal || resendClientSignleton();

export default resend;

if (process.env.NODE_ENV !== 'production') globalThis.resendGlobal = resend;