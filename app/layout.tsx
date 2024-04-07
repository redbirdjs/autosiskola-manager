import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

import { Toaster } from '@/components/ui/toaster'

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: {
    template: '%s | DSM',
    default: 'Driving School Manager'
  },
  description: 'Driving School Manager Application',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body className={cn('min-h-screen bg-background text-foreground font-sans antialiased', fontSans.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
