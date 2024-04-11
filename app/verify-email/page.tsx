import EmailVerify from '@/components/email-verification/EmailVerify'

export default function EmailVerificationPage({ searchParams }: { searchParams: { token: string } }) {
  const token = searchParams.token || '';

  return (
    <div>
      <EmailVerify verifyToken={token} />
    </div>
  ); 
}