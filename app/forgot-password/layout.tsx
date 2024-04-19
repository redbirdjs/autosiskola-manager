export default function ForgotPasswordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='min-w-screen min-h-screen flex flex-col items-center justify-center gap-2'>
      { children }
    </main>
  );
}