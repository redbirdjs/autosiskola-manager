import { Html, Head, Body, Tailwind, Preview, Container, Heading, Section, Hr, Img, Text } from '@react-email/components'
import * as React from 'react'
import { NewLoginProps } from '@/emails/definitions';

export default function Email({ address, userAgent }: NewLoginProps) {
  const previewText = 'New login from a different location';
  
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans px-2'>
          <Container className='border border-solid border-[#eaeaea] rounded-lg p-5'>
            <Heading className='text-center text-black'>New Login Detected</Heading>
            <Hr />
            <Section className='my-10'>
              <Img src={`${process.env.SITE_URL || 'http://localhost:3000'}/vercel.svg`} height={50} alt='Logo of the Driving School Manager' className='my-0 mx-auto text-center' />
            </Section>
            <Section>
              <Text>A new login was detected from <strong>{ address } ({ userAgent })</strong></Text>
            </Section>
            <Section>
              <Text className='text-[#666666] text-sm text-justify'>If it wasn&apos;t you who logged in, please change your password, be sure not to use the same password as for your email address. Changing your password will <span className='text-black font-bold'>unlink all devices from your account</span>. If you no longer have access to your account contact us via email.</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}