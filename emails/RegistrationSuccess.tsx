import { Html, Head, Tailwind, Body, Container, Heading, Preview, Hr, Section, Text, Img, Row, Column, Button } from '@react-email/components'
import * as React from 'react'

interface Email {
  username: string;
  realname: string;
  passport: string;
  url: string;
}

export function Email({ username, realname, passport, url }: Email) {
  const previewText = "Registration Successful - Welcome to DSM";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans px-2'>
          <Container className='border border-solid border-[#eaeaea] rounded-lg p-5'>
            <Heading className='text-center text-black'>Welcome to DSM!</Heading>
            <Hr />
            <Section className='my-10'>
              <Img src={`http://localhost:3000/vercel.svg`} height={50} alt='Logo of the Driving School' className='my-0 mx-auto text-center' />
            </Section>
            <Section>
              <Text className='text-black'>You have successfully registered an account!</Text>
            </Section>
            <Section>
              <Heading as='h2'>Account details</Heading>
              <Hr />
              <Row>
                <Column className='text-black'>Username: <strong>{username}</strong></Column>
              </Row>
              <Row>
                <Column className='text-black'>Full Name: <strong>{realname}</strong></Column>
              </Row>
              <Row>
                <Column className='text-black'>Passport No.: <strong>{passport?.slice(-2).padStart(9, '*') || ''}</strong></Column>
              </Row>
            </Section>
            <Section>
              <Heading as='h2' className='text-black'>Email verification</Heading>
              <Hr />
              <Row className='my-10'>
                <Column className='text-justify text-black'>You have to verify your email address to select a course you want to take. Click the  button below to verify your email address.</Column>
              </Row>
              <Button href={url} className='mb-5 px-5 py-3 bg-black text-white rounded-lg'>Verify Email</Button>
              <Row>
                <Column>If the button doesn&apos;t work, try this link below:</Column>
              </Row>
              <Row>
                <Column><a href={url} className='text-black'>{url}</a></Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default Email;