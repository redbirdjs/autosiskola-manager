import { NextRequest, NextResponse, } from 'next/server'
import { redirect } from 'next/navigation'

import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) return redirect('/');

  const user = await prisma.user.findUnique({ where: { verifyToken: token } });
  if (!user) return redirect('/');

  await prisma.user.update({ data: { verifyToken: '' }, where: { verifyToken: token } });
  return NextResponse.json({ msg: 'You have successfully verified your email address. You can now access all the features of the site.' });
}