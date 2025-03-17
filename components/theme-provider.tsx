'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, defaultTheme, ...props }: ThemeProviderProps) {
  const theme = defaultTheme || 'light'; // Ensure a default theme is set
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
