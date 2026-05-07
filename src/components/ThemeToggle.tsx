'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

function ThemeIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-5-8a5 5 0 0 0 5 5V7a5 5 0 0 0-5 5Z"
      />
    </svg>
  )
}

export function ThemeToggle({
  className,
  iconClassName,
  children,
}: {
  className?: string
  iconClassName?: string
  children?: React.ReactNode
}) {
  let [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }

    let storedTheme = window.localStorage.getItem('theme')

    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme
    }

    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  })
  let otherTheme: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      type="button"
      className={clsx(
        'group absolute top-4 right-4 z-50 -m-2.5 p-2.5',
        className,
      )}
      onClick={() => setTheme(otherTheme)}
    >
      <span className="sr-only">Switch to {otherTheme} theme</span>
      {children ?? (
        <ThemeIcon
          className={clsx(
            'h-6 w-6 fill-white opacity-50 transition-opacity group-hover:opacity-100 lg:fill-gray-900 lg:dark:fill-white',
            iconClassName,
          )}
        />
      )}
    </button>
  )
}
