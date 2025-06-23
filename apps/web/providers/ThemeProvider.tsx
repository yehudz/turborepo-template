'use client'

import { createContext, useContext, useState } from 'react'
import { ThemeModeE } from '@repo/types'

interface ThemeContextI {
  theme: ThemeModeE
  setTheme: (theme: ThemeModeE) => void
}

const ThemeContext = createContext<ThemeContextI | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeModeE
}

export default function ThemeProvider({ 
  children, 
  defaultTheme = ThemeModeE.SYSTEM 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeModeE>(defaultTheme)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}