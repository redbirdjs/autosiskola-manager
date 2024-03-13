import { Html, Head, Body, Tailwind, Preview, Container, Section, Heading, Hr, Text, Button } from '@react-email/components'
import * as React from 'react'

interface Email {
  url: string
}

export default function Email({ url }: Email) {
  const previewText = 'Password Reset';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans px-2'>
          <Container className='border border-solid border-[#eaeaea] rounded-lg p-5'>
            <Heading className='text-center text-black'>Password Reminder</Heading>
            <Hr />
            <Section>
              <Text className='text-black'>You got this email, because someone tried to reset your password. You can change your password by clicking on the button below:</Text>
            </Section>
            <Section className='text-center'>
              <Button href={url} className='mt-5 mb-5 px-5 py-3 bg-black text-white rounded-lg'>Reset Password</Button>
            </Section>
            <Section>
              <Text>If the button doesn&apos;t work click try this link:</Text>
              <a href={url} className='text-black'>{url}</a>
              <p className='text-[#666666] text-sm text-justify'>If you were not expecting this password reset, you can ignore this email. If you are concerned about your account&apos;s safety, reply to this email to get in contact with us.</p>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}