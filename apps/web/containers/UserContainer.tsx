import { UserI, StatusE } from '@repo/types'
import { useState } from 'react'

interface UserContainerProps {
  children: React.ReactNode
}

export default function UserContainer({ children }: UserContainerProps) {
  const [user, setUser] = useState<UserI | null>(null)
  const [status, setStatus] = useState<StatusE>(StatusE.IDLE)

  return (
    <div className="user-container">
      <div className="user-status">Status: {status}</div>
      {children}
    </div>
  )
}