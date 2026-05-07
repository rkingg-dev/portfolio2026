'use client'

import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'

import { Intro, IntroFooter } from '@/components/Intro'
import { GhostMark } from '@/components/Logo'
import { StarField } from '@/components/StarField'
import { ThemeToggle } from '@/components/ThemeToggle'

type Section = 'portfolio' | 'notes' | 'about'

function Glow() {
  let id = useId()

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gray-950 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-lg">
      <svg
        className="absolute -bottom-48 left-[-40%] h-320 w-[180%] lg:top-[-40%] lg:-right-40 lg:bottom-auto lg:left-auto lg:h-[180%] lg:w-7xl"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${id}-desktop`} cx="100%">
            <stop offset="0%" stopColor="rgba(255, 128, 32, 0.34)" />
            <stop offset="53.95%" stopColor="rgba(255, 128, 32, 0.12)" />
            <stop offset="100%" stopColor="rgba(10, 14, 23, 0)" />
          </radialGradient>
          <radialGradient id={`${id}-mobile`} cy="100%">
            <stop offset="0%" stopColor="rgba(255, 128, 32, 0.34)" />
            <stop offset="53.95%" stopColor="rgba(255, 128, 32, 0.12)" />
            <stop offset="100%" stopColor="rgba(10, 14, 23, 0)" />
          </radialGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id}-desktop)`}
          className="hidden lg:block"
        />
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id}-mobile)`}
          className="lg:hidden"
        />
      </svg>
      <StarField
        seed={12}
        starCount={72}
        constellationCount={2}
        ariesCount={3}
        className="-top-10 -left-60 opacity-65 lg:-top-12 lg:-left-56 lg:w-[68rem]"
      />
      <StarField
        seed={29}
        starCount={58}
        constellationCount={1}
        ariesCount={3}
        className="top-[24%] -left-72 opacity-48 lg:w-[72rem]"
      />
      <StarField
        seed={47}
        starCount={54}
        constellationCount={1}
        ariesCount={2}
        className="top-[54%] -left-60 opacity-36 lg:w-[68rem]"
      />
      <StarField
        seed={83}
        starCount={42}
        constellationCount={0}
        ariesCount={1}
        className="top-[10%] -left-16 opacity-28 lg:w-[56rem]"
      />
      <StarField
        seed={118}
        starCount={260}
        constellationCount={0}
        ariesCount={0}
        tiny
        animated={false}
        className="-top-20 -left-80 opacity-30 lg:w-[88rem]"
      />
      <StarField
        seed={154}
        starCount={230}
        constellationCount={0}
        ariesCount={0}
        tiny
        animated={false}
        className="top-[38%] -left-72 opacity-22 lg:w-[84rem]"
      />
      <div className="absolute inset-x-0 right-0 bottom-0 h-px bg-white mix-blend-overlay lg:top-0 lg:left-auto lg:h-auto lg:w-px" />
    </div>
  )
}

function FixedSidebar({
  main,
  footer,
}: {
  main: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="relative flex-none overflow-hidden px-6 lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex lg:px-0">
      <Glow />
      <div className="relative flex w-full lg:pointer-events-auto lg:mr-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-lg lg:overflow-x-hidden lg:overflow-y-auto lg:pl-[max(4rem,calc(50%-38rem))]">
        <div className="mx-auto max-w-lg lg:mx-0 lg:flex lg:w-96 lg:max-w-none lg:flex-col lg:before:flex-1 lg:before:pt-6">
          <div className="pt-20 pb-16 sm:pt-32 sm:pb-20 lg:py-20">
            <div className="relative">
              {main}
            </div>
          </div>
          <div className="hidden flex-1 items-end justify-center pb-4 lg:flex lg:justify-start lg:pb-6">
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}

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

function MobileHeader({ visible }: { visible: boolean }) {
  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 border-b border-gray-950/10 bg-white/85 px-4 backdrop-blur-xl transition duration-300 dark:border-white/10 dark:bg-gray-950/85 lg:hidden',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-full opacity-0',
      )}
    >
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between">
        <div className="flex min-w-0 items-center gap-x-2.5">
          <GhostMark className="h-8 w-8 shrink-0" />
          <span className="font-display text-base/6 font-light tracking-[0.08em] text-gray-950 [font-variant-caps:all-small-caps] dark:text-white">
            rkingg//
          </span>
        </div>
        <ThemeToggle
          className="static -mr-2 m-0 p-2"
          iconClassName="fill-gray-950 opacity-60 dark:fill-white"
        />
      </div>
    </header>
  )
}

function MobileFooter({
  activeSection,
  onSelectSection,
}: {
  activeSection: Section
  onSelectSection?: (section: Section) => void
}) {
  let items = [
    { label: 'Selected Work', section: 'portfolio' as const, icon: PortfolioIcon },
    { label: 'Notes', section: 'notes' as const, icon: NotesIcon },
    { label: 'R KINGG', section: 'about' as const, icon: DevIcon },
  ]

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] lg:hidden">
      <nav className="mx-auto grid max-w-[13rem] grid-cols-3 gap-1 rounded-full border border-orange-300/20 bg-gray-950/60 p-1 shadow-2xl shadow-black/25 backdrop-blur-2xl supports-[backdrop-filter]:bg-gray-950/45">
        {items.map((item) => (
          <button
            key={item.section}
            type="button"
            aria-label={item.label}
            onClick={() => onSelectSection?.(item.section)}
            className={
              activeSection === item.section
                ? 'grid h-10 place-items-center rounded-full bg-orange-300 text-gray-950 shadow-sm shadow-orange-500/30'
                : 'grid h-10 place-items-center rounded-full text-white/55 transition hover:bg-white/8 hover:text-orange-200'
            }
          >
            <item.icon className="h-4.5 w-4.5" />
            <span className="sr-only">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </footer>
  )
}

export function Layout({
  activeSection = 'portfolio',
  onSelectSection,
  scrollKey,
  children,
}: {
  activeSection?: Section
  onSelectSection?: (section: Section) => void
  scrollKey?: string
  children: React.ReactNode
}) {
  let introRef = useRef<HTMLDivElement>(null)
  let scrollRef = useRef<HTMLDivElement>(null)
  let wheelLockRef = useRef(false)
  let [showMobileHeader, setShowMobileHeader] = useState(false)

  useEffect(() => {
    function updateMobileHeader() {
      let intro = introRef.current

      if (!intro || window.innerWidth >= 1024) {
        setShowMobileHeader(false)
        return
      }

      let introBottom = intro.offsetTop + intro.offsetHeight
      setShowMobileHeader(window.scrollY >= introBottom - 56)
    }

    updateMobileHeader()
    window.addEventListener('scroll', updateMobileHeader, { passive: true })
    window.addEventListener('resize', updateMobileHeader)

    return () => {
      window.removeEventListener('scroll', updateMobileHeader)
      window.removeEventListener('resize', updateMobileHeader)
    }
  }, [])

  useEffect(() => {
    let scrollContainer = scrollRef.current

    if (!scrollContainer) {
      return
    }

    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })

    if (window.innerWidth < 1024 || !['portfolio', 'notes'].includes(activeSection)) {
      return
    }

    let frame = window.requestAnimationFrame(() => {
      let firstSelectorItem = scrollContainer.querySelector<HTMLElement>(
        '[data-selector-item]',
      )

      firstSelectorItem?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [activeSection, scrollKey])

  function handleSelectorWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (
      window.innerWidth < 1024 ||
      !['portfolio', 'notes'].includes(activeSection) ||
      Math.abs(event.deltaY) < 8
    ) {
      return
    }

    let scrollContainer = scrollRef.current
    let selectorItems = Array.from(
      scrollContainer?.querySelectorAll<HTMLElement>('[data-selector-item]') ??
        [],
    )

    if (!scrollContainer || selectorItems.length === 0) {
      return
    }

    event.preventDefault()

    if (wheelLockRef.current) {
      return
    }

    let containerRect = scrollContainer.getBoundingClientRect()
    let containerCenter = containerRect.top + containerRect.height / 2
    let currentIndex = selectorItems.reduce((closestIndex, item, index) => {
      let itemRect = item.getBoundingClientRect()
      let itemCenter = itemRect.top + itemRect.height / 2
      let closestRect = selectorItems[closestIndex].getBoundingClientRect()
      let closestCenter = closestRect.top + closestRect.height / 2

      return Math.abs(itemCenter - containerCenter) <
        Math.abs(closestCenter - containerCenter)
        ? index
        : closestIndex
    }, 0)
    let nextIndex = Math.min(
      Math.max(currentIndex + Math.sign(event.deltaY), 0),
      selectorItems.length - 1,
    )

    if (nextIndex === currentIndex) {
      selectorItems[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      return
    }

    wheelLockRef.current = true
    selectorItems[nextIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })

    window.setTimeout(() => {
      wheelLockRef.current = false
    }, 620)
  }

  return (
    <>
      <div ref={introRef}>
        <FixedSidebar
          main={
            <Intro
              activeSection={activeSection}
              onSelectSection={onSelectSection}
            />
          }
          footer={
            <IntroFooter
              activeSection={activeSection}
              onSelectSection={onSelectSection}
            />
          }
        />
      </div>
      <MobileHeader visible={showMobileHeader} />
      <div
        ref={scrollRef}
        onWheel={handleSelectorWheel}
        className={clsx(
          'relative flex-auto pb-24 lg:h-screen lg:overscroll-contain lg:scroll-smooth lg:scroll-py-[38vh] lg:pb-0',
          'lg:snap-y lg:snap-mandatory lg:overflow-y-auto',
        )}
      >
        <main>{children}</main>
      </div>
      <MobileFooter
        activeSection={activeSection}
        onSelectSection={onSelectSection}
      />
    </>
  )
}
