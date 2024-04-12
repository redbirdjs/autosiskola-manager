import { Html, Head, Body, Tailwind, Preview, Container, Heading, Section, Hr, Text } from '@react-email/components'
import * as React from 'react'
import { UserAddedProps } from '@/emails/definitions'

export default function Email({ username, password }: UserAddedProps) {
  const previewText = 'User has been added to DSM with this email address';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans px-2'>
          <Container className='border border-solid border-[#eaeaea] rounded-lg p-5'>
            <Heading className='text-black text-center'>User Created</Heading>
            <Hr />
            <Section>
              A new account has been created to Driving School Manager with this email address.
            </Section>
            <Section>
              <Heading as='h2' className='border-b border-solid border-b-black border-t-transparent border-x-transparent'>Account Details</Heading>
              <Text>
                <strong>Username:</strong> { username }<br />
                <strong>Password:</strong> { password }
              </Text>
            </Section>
            <Section>
              <Text className='text-[#666666] text-sm text-justify'><strong>We highly recommend to change your password to avoid any potential leaks.</strong></Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}