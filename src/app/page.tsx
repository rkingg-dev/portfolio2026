'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Layout } from '@/components/Layout'

type Section = 'portfolio' | 'notes' | 'about' | 'client'

type PortfolioItem = {
  slug: string
  title: string
  date: string
  description: string
  thumbnail: string
  role: string
  stack: string[]
  details: string[]
}

type NoteItem = {
  slug: string
  title: string
  date: string
  description: string
  details: string[]
}

const ITEMS_PER_PAGE = 6
const portfolioThumbnails = {
  orangeCode:
    'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1806&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  neonLaptop:
    'https://images.unsplash.com/photo-1763568258143-904ea924ac53?auto=format&fit=crop&fm=jpg&q=80&w=1600',
  orangeMug:
    'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1600',
  orangeWorkspace:
    'https://images.pexels.com/photos/34803990/pexels-photo-34803990.jpeg?auto=compress&cs=tinysrgb&w=1600',
}

const portfolioItems: PortfolioItem[] = [
  {
    slug: 'studio-booking',
    title: 'Studio Booking Dashboard',
    date: '2026-04-18',
    description:
      'A compact scheduling flow for creative studios handling inquiries, deposits, and session calendars.',
    thumbnail: portfolioThumbnails.orangeCode,
    role: 'Product design and frontend build',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    details: [
      'Designed a fast overview screen for checking booking status, client notes, and pending confirmations.',
      'Built reusable UI patterns for timeline rows, status badges, and quick action controls.',
      'Kept the interface quiet and dense so repeated daily use feels practical instead of decorative.',
    ],
  },
  {
    slug: 'creator-site',
    title: 'Creator Portfolio System',
    date: '2026-03-29',
    description:
      'A personal site structure for publishing case studies, selected work, and short-form writing from one content model.',
    thumbnail: portfolioThumbnails.orangeMug,
    role: 'Information architecture and interface direction',
    stack: ['Next.js', 'MDX', 'Static content'],
    details: [
      'Mapped portfolio items into a simple data shape that can later move to a CMS without changing the UI.',
      'Created a section-based navigation model so work, notes, and social links stay in one focused surface.',
      'Prioritized scan-friendly cards with enough metadata to decide what to open next.',
    ],
  },
  {
    slug: 'brand-console',
    title: 'Brand Console Prototype',
    date: '2026-02-11',
    description:
      'An internal prototype for managing brand assets, launch copy, and campaign handoff notes.',
    thumbnail: portfolioThumbnails.neonLaptop,
    role: 'Frontend prototype',
    stack: ['React', 'Component systems', 'Design systems'],
    details: [
      'Translated loose operational requirements into a clean prototype for stakeholder review.',
      'Built the main content areas around comparison, filtering, and quick inspection.',
      'Used restrained interaction states so the tool feels polished without getting in the user\'s way.',
    ],
  },
  {
    slug: 'learning-hub',
    title: 'Learning Hub Redesign',
    date: '2026-01-24',
    description:
      'A refreshed course browsing and lesson flow for a training platform with dense content needs.',
    thumbnail: portfolioThumbnails.orangeWorkspace,
    role: 'Frontend build and UI polish',
    stack: ['WordPress', 'JavaScript', 'Tailwind CSS'],
    details: [
      'Reworked page hierarchy so lessons, resources, and progress states are easier to scan.',
      'Built reusable blocks for course previews, instructor notes, and completion markers.',
      'Improved perceived speed by trimming visual noise and tightening above-the-fold content.',
    ],
  },
  {
    slug: 'commerce-migration',
    title: 'Commerce Migration Toolkit',
    date: '2025-12-08',
    description:
      'A migration support interface for organizing product data, content checks, and launch tasks.',
    thumbnail: portfolioThumbnails.orangeCode,
    role: 'Interface direction',
    stack: ['React', 'CMS', 'E-commerce'],
    details: [
      'Designed migration status views for products, media, content, and redirects.',
      'Created reusable empty, warning, and ready states for operations-heavy workflows.',
      'Kept the UI compact so teams could resolve issues without jumping across tools.',
    ],
  },
  {
    slug: 'marketing-site-system',
    title: 'Marketing Site System',
    date: '2025-10-17',
    description:
      'A modular landing page system for campaign pages, lead capture, and fast iteration.',
    thumbnail: portfolioThumbnails.orangeMug,
    role: 'Design system and build',
    stack: ['Webflow', 'CMS', 'Analytics'],
    details: [
      'Built repeatable content sections for offers, proof, comparison, and inquiry flows.',
      'Aligned visual rules so new pages could ship quickly without feeling templated.',
      'Added tracking-ready CTA patterns for measuring campaign performance.',
    ],
  },
  {
    slug: 'operations-portal',
    title: 'Operations Portal',
    date: '2025-08-04',
    description:
      'A private internal portal for tracking requests, documents, team updates, and approvals.',
    thumbnail: portfolioThumbnails.neonLaptop,
    role: 'Frontend prototype and implementation',
    stack: ['Next.js', 'TypeScript', 'Dashboard UI'],
    details: [
      'Created role-based screen patterns for requests, approvals, and internal notes.',
      'Designed table and detail views for fast repeated use by non-technical teams.',
      'Prepared the UI for future authentication and backend integration.',
    ],
  },
  {
    slug: 'booking-microsite',
    title: 'Booking Microsite',
    date: '2025-06-19',
    description:
      'A lightweight service booking site with clear packages, inquiry capture, and handoff notes.',
    thumbnail: portfolioThumbnails.orangeWorkspace,
    role: 'Design and website build',
    stack: ['WordPress', 'PHP', 'JavaScript'],
    details: [
      'Structured service pages around conversion paths and client questions.',
      'Customized forms and notifications to support faster lead follow-up.',
      'Optimized content blocks for mobile browsing and low-friction inquiries.',
    ],
  },
  {
    slug: 'brand-guidelines-app',
    title: 'Brand Guidelines App',
    date: '2025-04-02',
    description:
      'A compact reference app for colors, typography, components, and downloadable assets.',
    thumbnail: portfolioThumbnails.orangeCode,
    role: 'Product UI and frontend',
    stack: ['React', 'Design tokens', 'Static content'],
    details: [
      'Turned brand rules into a browsable interface with clear usage sections.',
      'Created preview cards for tokens, components, and asset downloads.',
      'Balanced documentation density with a visual presentation that felt designed.',
    ],
  },
  {
    slug: 'client-handoff-space',
    title: 'Client Handoff Space',
    date: '2025-02-12',
    description:
      'A private handoff experience for project files, decisions, notes, and launch status.',
    thumbnail: portfolioThumbnails.orangeMug,
    role: 'Experience design',
    stack: ['Next.js', 'Content model', 'Client portal'],
    details: [
      'Mapped the handoff flow from preview links to launch checklists and final files.',
      'Designed calm status states so clients could understand project progress quickly.',
      'Prepared a structure that can connect to auth and storage later.',
    ],
  },
]

const notes: NoteItem[] = [
  {
    slug: 'portfolio-pages-that-work',
    title: 'Building portfolio pages that do actual work',
    date: '2026-04-30',
    description:
      'A short reflection on replacing generic showcase layouts with pages that explain decisions, constraints, and taste.',
    details: [
      'A strong project page should make the decision-making visible. Screenshots matter, but the useful part is the path: what was unclear, what got simplified, and why the final interface deserves trust.',
      'The best portfolios feel less like a gallery and more like a working surface. They help someone understand how you think before they ever book a call.',
    ],
  },
  {
    slug: 'small-interface-details',
    title: 'Small interface details I keep coming back to',
    date: '2026-03-14',
    description:
      'Notes on spacing, contrast, and navigation patterns that make a digital product feel easier to trust.',
    details: [
      'Small details carry a lot of emotional weight: the distance between labels and values, the way a hover state confirms intent, and whether the interface feels calm under repeated use.',
      'Polish is not decoration here. It is a way of removing tiny moments of doubt.',
    ],
  },
  {
    slug: 'client-confidence',
    title: 'Designing around client confidence',
    date: '2026-02-22',
    description:
      'How clear previews, restrained copy, and visible progress reduce friction during project delivery.',
    details: [
      'Clients rarely need more interface. They usually need clearer status, fewer surprises, and a preview that answers the next obvious question.',
      'Confidence comes from rhythm: show what changed, show what is waiting, and make the next action feel safe.',
    ],
  },
  {
    slug: 'quiet-dashboards',
    title: 'Why dashboards should feel quiet',
    date: '2026-01-09',
    description:
      'A note on making operational screens dense enough for work without turning them into visual noise.',
    details: [
      'A dashboard should not compete with the work. It should hold information in a way that makes comparison, triage, and small decisions feel light.',
      'Quiet screens still need personality, but the personality should live in proportion, typography, contrast, and the right amount of restraint.',
    ],
  },
  {
    slug: 'one-easy-homepage-decision',
    title: 'The homepage should make one decision easy',
    date: '2025-12-18',
    description:
      'Thoughts on simplifying first screens so visitors understand what to inspect, trust, or click next.',
    details: [
      'A homepage does not need to explain everything at once. Its first job is to make one good next step obvious.',
      'When the first screen has a strong point of view, the rest of the site can breathe.',
    ],
  },
  {
    slug: 'small-site-shipping-check',
    title: 'What I check before shipping a small site',
    date: '2025-11-06',
    description:
      'A practical pass through responsive spacing, forms, metadata, speed, content rhythm, and client edits.',
    details: [
      'The final pass is mostly about friction: mobile spacing, form states, tap targets, metadata, image weight, and whether the content still reads naturally after the layout gets real.',
      'A small site can feel expensive when every edge has been looked at once more than expected.',
    ],
  },
  {
    slug: 'cms-structure-interface',
    title: 'CMS structure is part of the interface',
    date: '2025-09-27',
    description:
      'Why a clean editing model matters just as much as the public-facing layout.',
    details: [
      'A CMS is an interface for the person maintaining the site. If the model is confusing, the public UI eventually inherits that confusion.',
      'Clean fields, predictable naming, and flexible but bounded sections help the site age better.',
    ],
  },
  {
    slug: 'visual-polish-usability',
    title: 'When visual polish becomes usability',
    date: '2025-08-15',
    description:
      'Small transitions, focus states, and alignment choices can make an interface feel easier to use.',
    details: [
      'Motion can explain where attention moved. Contrast can tell someone what is available. Alignment can make a dense page feel calmer than it has any right to feel.',
      'Polish becomes usability when it lowers the amount of interpretation a person has to do.',
    ],
  },
  {
    slug: 'case-studies-need-constraints',
    title: 'Case studies need constraints',
    date: '2025-06-03',
    description:
      'A better project writeup explains tradeoffs, goals, and decisions instead of only showing screenshots.',
    details: [
      'Constraints make the work legible. They show what could not be done, what had to be prioritized, and what the design was actually solving.',
      'Without constraints, a case study can look polished while saying very little.',
    ],
  },
  {
    slug: 'private-portals-tone',
    title: 'Private portals need a different tone',
    date: '2025-04-21',
    description:
      'Client-facing workspaces should feel calm, exact, and useful before they feel impressive.',
    details: [
      'A private portal has a different job than a marketing page. It should reduce uncertainty, make files and decisions easy to find, and avoid theatrical UI that slows trust down.',
      'The tone should feel composed: clear status, simple hierarchy, and just enough polish to say the work is cared for.',
    ],
  },
]

const workExperience = [
  {
    period: '2023 - Present',
    company: 'Private company',
    location: 'Missouri',
    role: 'Web Development Manager',
    description:
      'Develops and customizes websites using WordPress and Webflow, handles PHP and JavaScript custom functionality, manages hosting, DNS, email configuration, and Cloudflare setup.',
  },
  {
    period: '2022 - 2023',
    company: 'Private company',
    location: 'Pasay City',
    role: 'Web App Developer',
    description:
      'Designed, developed, tested, and maintained business web applications in collaboration with designers and project managers.',
  },
  {
    period: '2019 - 2022',
    company: 'Private company',
    location: 'Clark, Pampanga',
    role: 'Web Developer',
    description:
      'Designed, developed, and maintained client websites, including over 100 e-commerce sites with custom themes, plugins, and marketing-focused improvements.',
  },
  {
    period: '2017 - 2018',
    company: 'Private company',
    location: 'Quezon City',
    role: 'WordPress Developer',
    description:
      'Built WordPress websites for GoDaddy clients, aligning design and functionality with client goals while maintaining site stability and security.',
  },
  {
    period: '2020 - 2023',
    company: 'Independent work',
    location: 'Freelance',
    role: 'Web App & WordPress Developer / Designer',
    description:
      'Delivered end-to-end freelance projects covering UI design, server and domain setup, development, testing, deployment, and client collaboration.',
  },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/rkingg__/',
    icon: 'instagram',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/rkingg',
    icon: 'facebook',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rkingg',
    icon: 'linkedin',
  },
]

function SocialIcon({
  icon,
  className,
}: {
  icon: (typeof socialLinks)[number]['icon']
  className?: string
}) {
  if (icon === 'instagram') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.75 1.5A3.25 3.25 0 0 0 1.5 4.75v6.5a3.25 3.25 0 0 0 3.25 3.25h6.5a3.25 3.25 0 0 0 3.25-3.25v-6.5a3.25 3.25 0 0 0-3.25-3.25h-6.5ZM3 4.75A1.75 1.75 0 0 1 4.75 3h6.5A1.75 1.75 0 0 1 13 4.75v6.5A1.75 1.75 0 0 1 11.25 13h-6.5A1.75 1.75 0 0 1 3 11.25v-6.5ZM8 5.25A2.75 2.75 0 1 0 8 10.75 2.75 2.75 0 0 0 8 5.25ZM6.75 8a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Zm4.5-2.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
        />
      </svg>
    )
  }

  if (icon === 'facebook') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
        <path
          fill="currentColor"
          d="M16 8.049C16 3.603 12.418 0 8 0S0 3.603 0 8.049C0 12.066 2.925 15.396 6.75 16v-5.624H4.719V8.049H6.75V6.275c0-2.017 1.194-3.132 3.022-3.132.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.62-1.304 1.257v1.512h2.219l-.355 2.327H9.25V16C13.075 15.396 16 12.066 16 8.049Z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M3.6 5.2H.8V15h2.8V5.2ZM2.2 3.85A1.63 1.63 0 1 0 2.2.6a1.63 1.63 0 0 0 0 3.25ZM15.2 9.6c0-2.64-1.4-4.1-3.44-4.1-1.58 0-2.29.87-2.68 1.48h-.04V5.2H6.36V15h2.8v-4.85c0-1.28.24-2.52 1.83-2.52 1.56 0 1.58 1.46 1.58 2.6V15h2.63V9.6Z"
      />
    </svg>
  )
}

function PrivateCompanyName({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex max-w-full select-none overflow-hidden rounded-[3px] bg-gray-950/8 px-2 py-0.5 align-baseline text-transparent ring-1 ring-gray-950/10 dark:bg-white/8 dark:ring-white/10">
      <span className="[text-shadow:0_0_8px_rgba(15,23,42,0.5)] dark:[text-shadow:0_0_8px_rgba(255,255,255,0.25)]">
        {children}
      </span>
      <span className="pointer-events-none absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-gray-950/70 dark:bg-white/70" />
      <span className="pointer-events-none absolute inset-x-1 top-[calc(50%+3px)] h-px -translate-y-1/2 bg-gray-950/45 dark:bg-white/45" />
      <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_4px,rgba(2,6,23,0.24)_4px,rgba(2,6,23,0.24)_6px)] dark:bg-[repeating-linear-gradient(135deg,transparent_0,transparent_4px,rgba(255,255,255,0.2)_4px,rgba(255,255,255,0.2)_6px)]" />
    </span>
  )
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}

function getScrollParent(element: HTMLElement) {
  let parent = element.parentElement

  while (parent) {
    let style = window.getComputedStyle(parent)

    if (/(auto|scroll)/.test(style.overflowY)) {
      return parent
    }

    parent = parent.parentElement
  }

  return null
}

function FocusItem({
  children,
  index,
  focusOnly = true,
}: {
  children: React.ReactNode
  index: number
  focusOnly?: boolean
}) {
  let itemRef = useRef<HTMLElement>(null)
  let [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    let item = itemRef.current

    if (!item) {
      return
    }

    let element = item
    let scrollParent = getScrollParent(element)
    let animationFrame = 0

    function updateFocus() {
      if (window.innerWidth < 1024) {
        setIsFocused(true)
        return
      }

      let parentRect = scrollParent?.getBoundingClientRect()
      let viewportCenter = parentRect
        ? parentRect.top + parentRect.height / 2
        : window.innerHeight / 2
      let selectorItems = Array.from(
        scrollParent?.querySelectorAll<HTMLElement>('[data-selector-item]') ??
          [element],
      )
      let nearestItem = selectorItems.reduce<HTMLElement | null>(
        (closestItem, selectorItem) => {
          if (!closestItem) {
            return selectorItem
          }

          let itemRect = selectorItem.getBoundingClientRect()
          let itemCenter = itemRect.top + itemRect.height / 2
          let closestRect = closestItem.getBoundingClientRect()
          let closestCenter = closestRect.top + closestRect.height / 2

          return Math.abs(itemCenter - viewportCenter) <
            Math.abs(closestCenter - viewportCenter)
            ? selectorItem
            : closestItem
        },
        null,
      )

      setIsFocused(nearestItem === element)
    }

    updateFocus()
    animationFrame = window.requestAnimationFrame(updateFocus)
    scrollParent?.addEventListener('scroll', updateFocus, { passive: true })
    window.addEventListener('resize', updateFocus)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      scrollParent?.removeEventListener('scroll', updateFocus)
      window.removeEventListener('resize', updateFocus)
    }
  }, [])

  return (
    <article
      ref={itemRef}
      data-selector-item=""
      data-focused={isFocused ? 'true' : undefined}
      className={clsx(
        'group transition duration-700 lg:snap-center',
        isFocused
          ? 'lg:pointer-events-auto lg:scale-100 lg:opacity-100 lg:blur-0'
          : clsx(
              'lg:scale-[0.94] lg:opacity-35 lg:blur-[3px] lg:saturate-50',
              focusOnly ? 'lg:pointer-events-none' : 'lg:pointer-events-auto',
            ),
      )}
    >
      <div
        className="selector-enter"
        style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
      >
        {children}
      </div>
    </article>
  )
}

function ContentTransition({
  transitionKey,
  children,
}: {
  transitionKey: string
  children: React.ReactNode
}) {
  return (
    <div key={transitionKey} className="content-enter">
      {children}
    </div>
  )
}

function ContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
      <div className="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
        <div className="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center border-t border-gray-900/10 pt-6 dark:border-white/10 lg:snap-center"
    >
      <div className="flex items-center gap-x-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (item) => (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-current={page === item ? 'page' : undefined}
              className={clsx(
                'grid h-8 w-8 place-items-center rounded-lg text-sm/6 font-semibold transition duration-300 hover:-translate-y-0.5',
                page === item
                  ? 'scale-110 text-orange-500 dark:text-orange-300'
                  : 'text-gray-400 hover:text-gray-950 dark:text-white/35 dark:hover:text-white',
              )}
            >
              {item}
            </button>
          ),
        )}
      </div>
    </nav>
  )
}

function PortfolioList({
  items,
  onOpen,
  page,
  totalPages,
  onPageChange,
}: {
  items: PortfolioItem[]
  onOpen: (slug: string) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <ContentShell>
      <div className="space-y-14 lg:pt-[18vh] lg:pb-[38vh]">
        {items.map((item, index) => (
          <FocusItem key={item.slug} index={index}>
            <button
              type="button"
              onClick={() => onOpen(item.slug)}
              className="block w-full text-left transition duration-500"
            >
              <div className="relative overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-900/10 transition group-hover:ring-orange-400/50 lg:group-data-[focused=true]:ring-orange-400/50 dark:bg-gray-900 dark:ring-white/10">
                <Image
                  src={item.thumbnail}
                  alt=""
                  width={1600}
                  height={900}
                  className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 45vw, (min-width: 640px) 32rem, 95vw"
                  priority={item.slug === items[0].slug}
                />
              </div>
              <div className="mt-5 flex items-center gap-x-3 text-2xs/4 font-medium text-gray-500 dark:text-white/45">
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <span className="h-1 w-1 rounded-full bg-orange-400/70" />
                <span>{item.role}</span>
              </div>
              <h2 className="mt-3 font-display text-xl/8 font-semibold text-gray-950 transition group-hover:text-orange-500 lg:group-data-[focused=true]:text-orange-500 dark:text-white dark:group-hover:text-orange-300 dark:lg:group-data-[focused=true]:text-orange-300">
                {item.title}
              </h2>
              <p className="mt-3 text-sm/6 text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </button>
          </FocusItem>
        ))}
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={onPageChange}
        />
      </div>
    </ContentShell>
  )
}

function PortfolioDetail({
  item,
  onBack,
}: {
  item: PortfolioItem
  onBack: () => void
}) {
  return (
    <ContentShell>
      <article>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex rounded-lg px-2 py-0.5 text-[0.8125rem]/6 font-medium text-orange-500 transition hover:bg-gray-950/5 hover:text-orange-400 dark:text-orange-300 dark:hover:bg-white/5 dark:hover:text-orange-200"
        >
          &lt;- Back to portfolio
        </button>
        <div className="mt-6 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-900/10 dark:bg-gray-900 dark:ring-white/10">
          <Image
            src={item.thumbnail}
            alt=""
            width={1600}
            height={900}
            className="aspect-[16/9] w-full object-cover"
            sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 45vw, (min-width: 640px) 32rem, 95vw"
            priority
          />
        </div>
        <div className="mt-6 text-2xs/4 font-medium text-gray-500 dark:text-white/45">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
        </div>
        <h2 className="mt-3 font-display text-2xl/8 font-semibold text-gray-950 dark:text-white">
          {item.title}
        </h2>
        <p className="mt-4 text-sm/6 text-gray-600 dark:text-gray-300">
          {item.description}
        </p>
        <dl className="mt-8 grid gap-5 border-y border-gray-900/10 py-6 text-sm/6 dark:border-white/10 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-gray-950 dark:text-white">Role</dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-300">{item.role}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-950 dark:text-white">Stack</dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-300">
              {item.stack.join(', ')}
            </dd>
          </div>
        </dl>
        <div className="mt-8 space-y-4 text-sm/6 text-gray-600 dark:text-gray-300">
          {item.details.map((detail) => (
            <p key={detail}>{detail}</p>
          ))}
        </div>
      </article>
    </ContentShell>
  )
}

function NotesContent({
  items,
  onOpen,
  page,
  totalPages,
  onPageChange,
}: {
  items: NoteItem[]
  onOpen: (slug: string) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <ContentShell>
      <div className="space-y-12 lg:pt-[42vh] lg:pb-[38vh]">
        {items.map((note, index) => (
          <FocusItem key={note.title} index={index}>
            <button
              type="button"
              onClick={() => onOpen(note.slug)}
              className="block w-full text-left transition duration-500"
            >
              <p className="text-2xs/4 font-semibold uppercase tracking-[0.14em] text-orange-500">
                Field Notes
              </p>
              <time
                dateTime={note.date}
                className="mt-5 block text-2xs/4 font-medium text-gray-500 dark:text-white/45"
              >
                {formatDate(note.date)}
              </time>
              <h3 className="mt-2 font-display text-lg/7 font-semibold text-gray-950 dark:text-white">
                {note.title}
              </h3>
              <p className="mt-3 text-sm/6 text-gray-600 dark:text-gray-300">
                {note.description}
              </p>
            </button>
          </FocusItem>
        ))}
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={onPageChange}
        />
      </div>
    </ContentShell>
  )
}

function NoteDetail({
  note,
  onBack,
}: {
  note: NoteItem
  onBack: () => void
}) {
  return (
    <ContentShell>
      <article>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex rounded-lg px-2 py-0.5 text-[0.8125rem]/6 font-medium text-orange-500 transition hover:bg-gray-950/5 hover:text-orange-400 dark:text-orange-300 dark:hover:bg-white/5 dark:hover:text-orange-200"
        >
          &lt;- Back to notes
        </button>
        <p className="mt-8 text-2xs/4 font-semibold uppercase tracking-[0.14em] text-orange-500">
          Field Notes
        </p>
        <time
          dateTime={note.date}
          className="mt-5 block text-2xs/4 font-medium text-gray-500 dark:text-white/45"
        >
          {formatDate(note.date)}
        </time>
        <h2 className="mt-3 font-display text-2xl/8 font-semibold text-gray-950 dark:text-white">
          {note.title}
        </h2>
        <p className="mt-4 text-sm/6 text-gray-600 dark:text-gray-300">
          {note.description}
        </p>
        <div className="mt-8 space-y-4 border-t border-gray-900/10 pt-6 text-sm/6 text-gray-600 dark:border-white/10 dark:text-gray-300">
          {note.details.map((detail) => (
            <p key={detail}>{detail}</p>
          ))}
        </div>
      </article>
    </ContentShell>
  )
}

function AboutContent() {
  return (
    <ContentShell>
      <div className="content-enter">
        <p className="text-2xs/4 font-semibold uppercase tracking-[0.14em] text-orange-500">
          About Me
        </p>
        <h2 className="mt-3 font-display text-2xl/8 font-semibold text-gray-950 dark:text-white">
          R King Garcia
        </h2>
        <p className="mt-4 text-sm/6 text-gray-600 dark:text-gray-300">
          Web developer and designer based in Angeles City, Pampanga with over
          8 years across agency, in-house, freelance, and product-facing web
          work.
        </p>
        <dl className="mt-8 grid gap-5 border-y border-gray-900/10 py-6 text-sm/6 dark:border-white/10 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-gray-950 dark:text-white">
              Location
            </dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-300">
              Angeles City, Pampanga, PH
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-950 dark:text-white">
              Focus
            </dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-300">
              Web apps, WordPress, Webflow, UI design, hosting, deployment
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-950 dark:text-white">
              Experience
            </dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-300">
              2017 - Present
            </dd>
          </div>
        </dl>
        <div className="mt-10">
          <h3 className="font-display text-lg/7 font-semibold text-gray-950 dark:text-white">
            Work Experience
          </h3>
          <div className="mt-6 space-y-8">
            {workExperience.map((work) => (
              <article key={`${work.role}-${work.period}`}>
                <div className="flex flex-wrap items-center gap-x-3 text-2xs/4 font-medium text-gray-500 dark:text-white/45">
                  <span>{work.period}</span>
                  <span className="h-1 w-1 rounded-full bg-orange-400/70" />
                  <span>{work.location}</span>
                </div>
                <h4 className="mt-2 font-display text-base/6 font-semibold text-gray-950 dark:text-white">
                  {work.role}
                </h4>
                <p className="mt-1 text-sm/6 font-medium text-orange-500 dark:text-orange-300">
                  <PrivateCompanyName>{work.company}</PrivateCompanyName>
                </p>
                <p className="mt-3 text-sm/6 text-gray-600 dark:text-gray-300">
                  {work.description}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-gray-900/10 pt-6 dark:border-white/10">
          <h3 className="font-display text-base/6 font-semibold text-gray-950 dark:text-white">
            Contact
          </h3>
          <a
            href="mailto:hello@rkingg.com"
            className="mt-3 inline-flex text-sm/6 font-semibold text-orange-500 transition hover:text-orange-400 dark:text-orange-300"
          >
            hello@rkingg.com
          </a>
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={
                  link.href.startsWith('mailto:') ? undefined : 'noreferrer'
                }
                aria-label={link.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-orange-400/10 text-orange-500 ring-1 ring-orange-400/30 transition hover:bg-orange-400/15 dark:text-orange-300"
              >
                <SocialIcon icon={link.icon} className="h-4 w-4 flex-none" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </ContentShell>
  )
}

function ClientLoginContent() {
  return (
    <ContentShell>
      <div className="lg:flex lg:min-h-screen lg:snap-center lg:items-start lg:pt-[24vh] lg:pb-16">
        <div className="w-full">
        <p className="text-2xs/4 font-semibold uppercase tracking-[0.14em] text-orange-500">
          Client Area
        </p>
        <h2 className="mt-3 font-display text-2xl/8 font-semibold text-gray-950 dark:text-white">
          Project dashboard access
        </h2>
        <p className="mt-4 text-sm/6 text-gray-600 dark:text-gray-300">
          Private project notes, previews, approvals, and handoff files live
          here. Access flow is still being wired up, so this preview stays
          parked for now.
        </p>

        <form className="mt-8 overflow-hidden rounded-2xl border border-gray-900/10 bg-gray-950 shadow-2xl shadow-gray-950/10 dark:border-white/10">
          <div className="border-b border-white/10 bg-gray-900/80 px-5 py-4">
            <div className="flex items-center justify-between gap-x-4">
              <div className="flex min-w-0 items-center gap-x-3">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-orange-400/10 text-orange-300 ring-1 ring-orange-400/30">
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.75 6.5V4.75a3.25 3.25 0 0 1 6.5 0V6.5H12A1.5 1.5 0 0 1 13.5 8v5A1.5 1.5 0 0 1 12 14.5H4A1.5 1.5 0 0 1 2.5 13V8A1.5 1.5 0 0 1 4 6.5h.75Zm1.5 0h3.5V4.75a1.75 1.75 0 1 0-3.5 0V6.5Z"
                    />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm/6 font-semibold text-white">
                    secure.rkingg/client
                  </p>
                  <p className="text-xs/5 text-gray-500">private workspace</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs/5 font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                Preview
              </span>
            </div>
          </div>

          <div className="space-y-4 px-5 py-5">
            <div>
              <label
                htmlFor="client-email"
                className="text-xs/5 font-semibold text-gray-400"
              >
                Email
              </label>
              <input
                id="client-email"
                type="email"
                placeholder="client@email.com"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm/6 text-white placeholder:text-gray-600 focus:border-orange-300 focus:outline-hidden"
              />
            </div>
            <div>
              <label
                htmlFor="client-password"
                className="text-xs/5 font-semibold text-gray-400"
              >
                Password
              </label>
              <input
                id="client-password"
                type="password"
                placeholder="********"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm/6 text-white placeholder:text-gray-600 focus:border-orange-300 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-gray-900/80 px-5 py-4">
            <div className="flex items-center gap-x-2 text-xs/5 text-gray-500">
              <span className="h-2 w-2 rounded-full bg-orange-300" />
              Access reveals private company and project data.
            </div>
            <button
              type="button"
              className="group relative isolate rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white"
            >
              <span className="absolute inset-0 rounded-md bg-linear-to-b from-white/80 to-white opacity-10 transition-opacity group-hover:opacity-15" />
              <span className="absolute inset-0 rounded-md opacity-7.5 shadow-[inset_0_1px_1px_white] transition-opacity group-hover:opacity-10" />
              Client access soon
            </button>
          </div>
        </form>
        </div>
      </div>
    </ContentShell>
  )
}

export default function Home() {
  const [section, setSection] = useState<Section>('portfolio')
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [selectedNoteSlug, setSelectedNoteSlug] = useState<string | null>(null)
  const [portfolioPage, setPortfolioPage] = useState(1)
  const [notesPage, setNotesPage] = useState(1)

  const selectedItem = useMemo(
    () => portfolioItems.find((item) => item.slug === selectedSlug) ?? null,
    [selectedSlug],
  )
  const selectedNote = useMemo(
    () => notes.find((note) => note.slug === selectedNoteSlug) ?? null,
    [selectedNoteSlug],
  )
  const portfolioTotalPages = Math.ceil(portfolioItems.length / ITEMS_PER_PAGE)
  const notesTotalPages = Math.ceil(notes.length / ITEMS_PER_PAGE)
  const paginatedPortfolioItems = portfolioItems.slice(
    (portfolioPage - 1) * ITEMS_PER_PAGE,
    portfolioPage * ITEMS_PER_PAGE,
  )
  const paginatedNotes = notes.slice(
    (notesPage - 1) * ITEMS_PER_PAGE,
    notesPage * ITEMS_PER_PAGE,
  )

  function selectSection(nextSection: Section) {
    setSection(nextSection)
    setSelectedSlug(null)
    setSelectedNoteSlug(null)
    setPortfolioPage(1)
    setNotesPage(1)
  }

  function transitionTo(updateView: () => void) {
    if (!document.startViewTransition) {
      updateView()
      return
    }

    document.startViewTransition(() => {
      flushSync(updateView)
    })
  }

  return (
    <Layout
      activeSection={section}
      onSelectSection={selectSection}
      scrollKey={`${section}-${portfolioPage}-${notesPage}-${selectedSlug ?? selectedNoteSlug ?? 'list'}`}
    >
      <ContentTransition
        transitionKey={`${section}-${selectedSlug ?? selectedNoteSlug ?? 'list'}-${portfolioPage}-${notesPage}`}
      >
        <div
          className={clsx(
            'py-20 sm:py-32',
            section === 'portfolio' && !selectedItem
              ? 'space-y-12'
              : 'space-y-20',
          )}
        >
          {section === 'portfolio' && selectedItem ? (
            <PortfolioDetail
              item={selectedItem}
              onBack={() => transitionTo(() => setSelectedSlug(null))}
            />
          ) : section === 'portfolio' ? (
            <PortfolioList
              items={paginatedPortfolioItems}
              onOpen={(slug) => transitionTo(() => setSelectedSlug(slug))}
              page={portfolioPage}
              totalPages={portfolioTotalPages}
              onPageChange={(page) => {
                transitionTo(() => {
                  setPortfolioPage(page)
                  setSelectedSlug(null)
                })
              }}
            />
          ) : section === 'notes' && selectedNote ? (
            <NoteDetail
              note={selectedNote}
              onBack={() => transitionTo(() => setSelectedNoteSlug(null))}
            />
          ) : section === 'notes' ? (
            <NotesContent
              items={paginatedNotes}
              onOpen={(slug) => transitionTo(() => setSelectedNoteSlug(slug))}
              page={notesPage}
              totalPages={notesTotalPages}
              onPageChange={(page) =>
                transitionTo(() => {
                  setNotesPage(page)
                  setSelectedNoteSlug(null)
                })
              }
            />
          ) : section === 'about' ? (
            <AboutContent />
          ) : (
            <ClientLoginContent />
          )}
        </div>
      </ContentTransition>
    </Layout>
  )
}
