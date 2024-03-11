import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register'
}

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      { children }
    </>
  );
}