import React from 'react'
import { styled } from '@tamagui/core'
import { Button as TamaguiButton, type ButtonProps as TamaguiButtonProps } from '@tamagui/button'

// Create styled Tamagui button matching shadcn exactly
const StyledButton = styled(TamaguiButton, {
  borderRadius: 6,
  fontWeight: '500',
  fontSize: 14,
  alignItems: 'center',
  justifyContent: 'center',
  disabledStyle: {
    opacity: 0.5,
  },
  
  variants: {
    variant: {
      default: {
        backgroundColor: '#09090b', // shadcn gray-900
        color: '#fafafa', // shadcn gray-50
        pressStyle: {
          backgroundColor: '#18181b', // slightly lighter on press
        },
      },
      destructive: {
        backgroundColor: '#dc2626', // shadcn red-600
        color: '#fafafa',
        pressStyle: {
          backgroundColor: '#b91c1c', // red-700 on press
        },
      },
      outline: {
        borderWidth: 1,
        borderColor: '#e4e4e7', // shadcn gray-200
        backgroundColor: 'transparent',
        color: '#09090b',
        pressStyle: {
          backgroundColor: '#f4f4f5', // gray-100 on press
        },
      },
      secondary: {
        backgroundColor: '#f4f4f5', // shadcn gray-100
        color: '#09090b',
        pressStyle: {
          backgroundColor: '#e4e4e7', // gray-200 on press
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#09090b',
        pressStyle: {
          backgroundColor: '#f4f4f5', // gray-100 on press
        },
      },
      link: {
        backgroundColor: 'transparent',
        color: '#09090b',
        textDecorationLine: 'underline',
        pressStyle: {
          opacity: 0.8,
        },
      },
    },
    size: {
      default: {
        height: 40,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
      },
      sm: {
        height: 36,
        paddingHorizontal: 12,
        borderRadius: 6,
        fontSize: 13,
      },
      lg: {
        height: 44,
        paddingHorizontal: 32,
        borderRadius: 8,
        fontSize: 16,
      },
      icon: {
        height: 40,
        width: 40,
        paddingHorizontal: 0,
        borderRadius: 6,
      },
    },
  },

  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export interface ButtonProps extends Omit<TamaguiButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button = React.forwardRef<
  React.ElementRef<typeof StyledButton>,
  ButtonProps
>(({ variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <StyledButton
      ref={ref}
      variant={variant}
      size={size}
      {...props}
    />
  )
})

Button.displayName = 'Button'