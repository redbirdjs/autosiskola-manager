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
              Your security is very important to us. This account was recently accessed from this IP address:
            </Section>
            <Section>
              <Heading as='h2' className='border-b border-solid border-b-black border-t-transparent border-x-transparent'>Details</Heading>
              <Text>
                <strong>Time:</strong> { (new Date()).toUTCString() }<br/>
                <strong>IP address:</strong> { address }<br/>
                <strong>Browser:</strong> { userAgent }
              </Text>
            </Section>
            <Section>
              <Text className='text-[#666666] text-sm text-justify'>If this was you, you can safely ignore this email. If you noticed any suspicious activity on your account, please change your password. If you have any questions or concerns, don&apos;t be affraid to contact us.</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}