import { type ReactNode } from "react"

export function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-lg border border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  )
}