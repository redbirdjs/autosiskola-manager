'use client'

import { Button } from '@/components/ui/button'
import { logout } from '@/utils/user-actions'

export default function LogoutButton() {
  const logOut = () => {
    logout();
  }

  return (
    <Button onClick={logOut}>Logout</Button>
  )
}