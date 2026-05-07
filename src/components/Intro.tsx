import clsx from 'clsx'
import Link from 'next/link'

import { Logo } from '@/components/Logo'
import { SignUpForm } from '@/components/SignUpForm'
import { ThemeToggle } from '@/components/ThemeToggle'

type Section = 'portfolio' | 'notes' | 'about' | 'client'

function PortfolioIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M2.75 2A1.75 1.75 0 0 0 1 3.75v8.5C1 13.216 1.784 14 2.75 14h10.5A1.75 1.75 0 0 0 15 12.25v-8.5A1.75 1.75 0 0 0 13.25 2H2.75Zm0 1.5h10.5a.25.25 0 0 1 .25.25V5h-11V3.75a.25.25 0 0 1 .25-.25ZM2.5 6.5h11v5.75a.25.25 0 0 1-.25.25H2.75a.25.25 0 0 1-.25-.25V6.5Z" />
    </svg>
  )
}

function NotesIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M3.75 1.5A1.75 1.75 0 0 0 2 3.25v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0 0 14 12.75v-7.4a1.75 1.75 0 0 0-.513-1.237l-2.1-2.1A1.75 1.75 0 0 0 10.15 1.5h-6.4Zm0 1.5h5.75v2.25c0 .69.56 1.25 1.25 1.25H12.5v6.25a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-9.5A.25.25 0 0 1 3.75 3Zm7.25.56L11.94 5H11a.25.25 0 0 1-.25-.25v-.94c.09.04.174.095.25.17ZM5.25 8a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Zm0 3a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" />
    </svg>
  )
}

function DevIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" {...props}>
      <path
        d="M5.75 4.25 2 8l3.75 3.75M10.25 4.25 14 8l-3.75 3.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

const navItems = [
  { section: 'portfolio' as const, label: 'Portfolio', icon: PortfolioIcon },
  { section: 'notes' as const, label: 'Notes', icon: NotesIcon },
  { section: 'about' as const, label: 'R KINGG', icon: DevIcon },
]

function MenuButton({
  active,
  children,
  icon: Icon,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'group relative isolate flex flex-none items-center rounded-lg px-2 py-0.5 text-[0.8125rem]/6 font-medium transition-colors',
        active ? 'text-orange-300' : 'text-white/30 hover:text-orange-300',
      )}
    >
      <span
        className={clsx(
          'absolute inset-0 -z-10 rounded-lg bg-white/5 transition',
          active
            ? 'scale-100 opacity-100'
            : 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100',
        )}
      />
      <Icon className="h-4 w-4 flex-none" />
      <span className="ml-3 self-baseline text-white">{children}</span>
    </button>
  )
}

export function Intro({
  activeSection = 'portfolio',
  onSelectSection,
}: {
  activeSection?: Section
  onSelectSection?: (section: Section) => void
}) {
  return (
    <>
      <div>
        <Link href="/">
          <Logo className="inline-flex items-center gap-x-3" />
        </Link>
      </div>
      <h1 className="mt-14 font-display text-4xl/tight font-light text-white">
        More than visuals. <span className="text-orange-300">Designed to work.</span>
      </h1>
      <p className="mt-4 text-sm/6 text-gray-300">
Modern web experiences designed with clarity, built with structure, and focused on how people use products. Creating polished interfaces, seamless interactions, and reliable systems that stay clean after launch.
      </p>
      <p className="mt-4 text-xs/5 font-medium italic text-orange-300">
        Featured work is placeholder content for now. Use the contact field
        below for real project inquiries.
      </p>
      <SignUpForm />
      <div className="mt-8 hidden flex-wrap justify-center gap-x-1 gap-y-3 sm:gap-x-2 lg:flex lg:justify-start">
        {navItems.map((item) => (
          <MenuButton
            key={item.section}
            active={activeSection === item.section}
            icon={item.icon}
            onClick={() => onSelectSection?.(item.section)}
          >
            {item.label}
          </MenuButton>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onSelectSection?.('client')}
        className="mt-5 hidden w-fit rounded-lg px-2 py-0.5 text-[0.8125rem]/6 font-medium text-white/60 transition hover:bg-white/5 hover:text-orange-300 lg:inline-flex"
      >
        Open workspace -&gt;
      </button>
    </>
  )
}

export function IntroFooter({
  activeSection = 'portfolio',
  onSelectSection,
}: {
  activeSection?: Section
  onSelectSection?: (section: Section) => void
}) {
  void activeSection
  void onSelectSection

  return (
    <div className="flex items-center gap-x-3 text-[0.6875rem]/5 font-medium text-white/30">
      <ThemeToggle className="static -m-0 p-0 text-orange-300 transition hover:text-orange-200">
        Dark mode
      </ThemeToggle>
      <span>Version v2.3.1</span>
    </div>
  )
}
