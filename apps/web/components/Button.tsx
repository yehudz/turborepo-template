import { ButtonVariantE, ButtonSizeE } from '@repo/types'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariantE
  size?: ButtonSizeE
  onClick?: () => void
}

export default function Button({ 
  children, 
  variant = ButtonVariantE.PRIMARY, 
  size = ButtonSizeE.MD,
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}