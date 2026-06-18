import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const getSystemTheme = (): Theme =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

export default function useTheme() {
  const getInitial = (): Theme => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem('theme') as Theme | null
    return saved ?? getSystemTheme()
  }

  const [theme, setThemeState] = useState<Theme>(getInitial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      // ignore storage errors
    }
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      // only follow system changes when the user hasn't set an explicit preference
      if (!localStorage.getItem('theme')) setThemeState(e.matches ? 'dark' : 'light')
    }
    if (mq.addEventListener) mq.addEventListener('change', handler)
    else mq.addListener(handler)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler)
      else mq.removeListener(handler)
    }
  }, [])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])

  return { theme, setTheme }
}
