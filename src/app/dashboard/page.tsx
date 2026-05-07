'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { GhostMark } from '@/components/Logo'

type Section =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'clients'
  | 'portfolio'
  | 'notes'
  | 'finance'

type Status = 'Discovery' | 'Design' | 'Build' | 'Review' | 'Live' | 'Paused'

const navItems: Array<{ id: Section; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'projects', label: 'Projects' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'clients', label: 'Clients' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'notes', label: 'Notes' },
  { id: 'finance', label: 'Finance' },
]

const projects = [
  {
    name: 'Studio Booking Dashboard',
    type: 'Web app',
    client: 'Private studio',
    status: 'Build' as Status,
    progress: 72,
    updated: 'May 6, 2026',
    portfolio: true,
    category: 'Product UI',
    description:
      'Booking, deposits, sessions, and client notes in one focused workspace.',
    budget: 6800,
    spent: 4100,
    income: 4600,
    expenses: 1200,
  },
  {
    name: 'Creator Portfolio System',
    type: 'Website',
    client: 'Independent creator',
    status: 'Review' as Status,
    progress: 88,
    updated: 'May 4, 2026',
    portfolio: true,
    category: 'Portfolio',
    description:
      'A calm publishing surface for case studies, notes, and selected work.',
    budget: 4200,
    spent: 3200,
    income: 4200,
    expenses: 700,
  },
  {
    name: 'Brand Console Prototype',
    type: 'Web app',
    client: 'Design team',
    status: 'Design' as Status,
    progress: 46,
    updated: 'Apr 29, 2026',
    portfolio: false,
    category: 'Internal tool',
    description:
      'A prototype for brand assets, campaign copy, and launch handoff.',
    budget: 5200,
    spent: 2100,
    income: 2600,
    expenses: 900,
  },
  {
    name: 'Learning Hub Redesign',
    type: 'Website',
    client: 'Training company',
    status: 'Live' as Status,
    progress: 100,
    updated: 'Apr 21, 2026',
    portfolio: true,
    category: 'CMS',
    description:
      'Course browsing, lesson layouts, and progress patterns for learners.',
    budget: 7500,
    spent: 6100,
    income: 7500,
    expenses: 1600,
  },
  {
    name: 'Operations Portal',
    type: 'Web app',
    client: 'Private operations team',
    status: 'Paused' as Status,
    progress: 35,
    updated: 'Apr 12, 2026',
    portfolio: false,
    category: 'Dashboard',
    description:
      'Requests, approvals, documents, and internal team updates.',
    budget: 9000,
    spent: 2400,
    income: 3000,
    expenses: 1400,
  },
]

const tasks = [
  {
    title: 'Polish mobile booking steps',
    project: 'Studio Booking Dashboard',
    assignedDate: 'May 3, 2026',
    dueDate: 'May 9, 2026',
    assignedBy: 'Roman',
    assignedTo: 'Client team',
    status: 'In progress',
  },
  {
    title: 'Review homepage case study copy',
    project: 'Creator Portfolio System',
    assignedDate: 'May 1, 2026',
    dueDate: 'May 8, 2026',
    assignedBy: 'Roman',
    assignedTo: 'Content lead',
    status: 'Review',
  },
  {
    title: 'Confirm brand asset naming',
    project: 'Brand Console Prototype',
    assignedDate: 'Apr 29, 2026',
    dueDate: 'May 7, 2026',
    assignedBy: 'Design lead',
    assignedTo: 'Roman',
    status: 'Queued',
  },
  {
    title: 'Final QA for course cards',
    project: 'Learning Hub Redesign',
    assignedDate: 'Apr 18, 2026',
    dueDate: 'Apr 24, 2026',
    assignedBy: 'Roman',
    assignedTo: 'QA reviewer',
    status: 'Done',
  },
]

const clients = [
  {
    name: 'Mara Ellison',
    company: 'Private studio',
    email: 'mara@example.com',
    project: 'Studio Booking Dashboard',
    status: 'Build',
    lastActivity: 'Uploaded session policy notes',
  },
  {
    name: 'Ian Cortez',
    company: 'Independent creator',
    email: 'ian@example.com',
    project: 'Creator Portfolio System',
    status: 'Review',
    lastActivity: 'Approved selected work layout',
  },
  {
    name: 'Nina Vale',
    company: 'Design team',
    email: 'nina@example.com',
    project: 'Brand Console Prototype',
    status: 'Design',
    lastActivity: 'Commented on asset library flow',
  },
  {
    name: 'Cole Ramos',
    company: 'Training company',
    email: 'cole@example.com',
    project: 'Learning Hub Redesign',
    status: 'Live',
    lastActivity: 'Downloaded launch assets',
  },
]

const notes = [
  {
    title: 'Launch checklist pass',
    date: 'May 6, 2026',
    excerpt:
      'Confirm DNS, redirect map, analytics events, and client handoff links before final push.',
  },
  {
    title: 'Dashboard tone direction',
    date: 'May 2, 2026',
    excerpt:
      'Keep it premium and calm: fewer colors, tighter spacing, clearer project state hierarchy.',
  },
  {
    title: 'Portfolio candidate criteria',
    date: 'Apr 28, 2026',
    excerpt:
      'Only include work with clear visuals, measurable decisions, and a useful story behind the interface.',
  },
]

const activity = [
  'Studio Booking Dashboard preview updated',
  'Creator Portfolio System moved to review',
  'Two tasks completed in Learning Hub Redesign',
  'Pending payment reminder drafted',
]

function StatusBadge({ status }: { status: string }) {
  let tone =
    status === 'Live' || status === 'Done'
      ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20'
      : status === 'Build' || status === 'In progress'
        ? 'bg-orange-400/10 text-orange-300 ring-orange-400/20'
        : status === 'Review'
          ? 'bg-amber-400/10 text-amber-300 ring-amber-400/20'
          : status === 'Paused' || status === 'Queued'
            ? 'bg-amber-400/10 text-amber-300 ring-amber-400/20'
            : 'bg-white/8 text-gray-300 ring-white/10'

  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-2 py-0.5 text-[0.6875rem]/5 font-semibold ring-1',
        tone,
      )}
    >
      {status}
    </span>
  )
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={clsx(
        'rounded-2xl border border-white/10 bg-white/[0.035] shadow-xl shadow-black/20 backdrop-blur',
        className,
      )}
    >
      {children}
    </section>
  )
}

function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[0.6875rem]/4 font-semibold uppercase tracking-[0.16em] text-orange-300">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-2xl/8 font-semibold text-white sm:text-[1.625rem]/8">
          {title}
        </h1>
      </div>
      {children}
    </div>
  )
}

function Sidebar({
  active,
  onChange,
}: {
  active: Section
  onChange: (section: Section) => void
}) {
  return (
    <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
      <Panel className="flex h-full flex-col overflow-hidden p-4">
        <Link href="/" className="inline-flex items-center gap-x-3">
          <GhostMark className="h-8 w-8" />
          <span className="font-display text-sm/6 font-light tracking-[0.08em] text-white [font-variant-caps:all-small-caps]">
            rkingg//
          </span>
        </Link>
        <nav className="mt-8 grid gap-1 text-[0.8125rem]/5 font-medium text-gray-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={clsx(
                'flex items-center justify-between rounded-xl px-3 py-2 text-left transition',
                active === item.id
                  ? 'bg-orange-400/10 text-white ring-1 ring-orange-400/20'
                  : 'hover:bg-white/5 hover:text-white',
              )}
            >
              <span>{item.label}</span>
              {active === item.id ? (
                <span className="h-1.5 w-1.5 rounded-full bg-orange-300" />
              ) : null}
            </button>
          ))}
        </nav>
        <div className="mt-8 rounded-2xl border border-white/10 bg-gray-950/50 p-4">
          <p className="text-[0.6875rem]/5 font-medium text-gray-500">
            Client preview
          </p>
          <p className="mt-1 text-[0.8125rem]/5 font-semibold text-white">
            Roman Workspace
          </p>
          <p className="mt-3 text-xs/5 text-gray-500">
            Static data only. Backend auth and storage are not connected yet.
          </p>
        </div>
        <Link
          href="/"
          className="mt-auto inline-flex rounded-lg px-2 py-0.5 text-[0.8125rem]/6 font-medium text-white/60 transition hover:bg-white/5 hover:text-orange-300"
        >
          &lt;- Back to portfolio
        </Link>
      </Panel>
    </aside>
  )
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <Panel className="p-4">
      <p className="text-[0.6875rem]/5 font-semibold uppercase tracking-[0.12em] text-gray-500">
        {label}
      </p>
      <p className="mt-3 font-display text-xl/7 font-semibold text-white">
        {value}
      </p>
      <p className="mt-1 text-xs/5 text-gray-500">{detail}</p>
    </Panel>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-linear-to-r from-orange-300 to-amber-200"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <Panel className="p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.055]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.6875rem]/5 font-medium text-gray-500">
            {project.type}
          </p>
          <h3 className="mt-1 font-display text-base/6 font-semibold text-white">
            {project.name}
          </h3>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-3 text-xs/5 text-gray-400">{project.description}</p>
      <div className="mt-4 grid gap-2 text-xs/5 text-gray-500">
        <div className="flex justify-between">
          <span>{project.client}</span>
          <span>{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} />
        <div className="flex justify-between">
          <span>Updated</span>
          <span>{project.updated}</span>
        </div>
      </div>
      {project.portfolio ? (
        <p className="mt-4 inline-flex rounded-full bg-orange-400/10 px-2 py-0.5 text-[0.6875rem]/5 font-semibold text-orange-300 ring-1 ring-orange-400/20">
          Included in Portfolio
        </p>
      ) : null}
    </Panel>
  )
}

function ActivityLog() {
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base/6 font-semibold text-white">
          Recent activity
        </h2>
        <span className="text-[0.6875rem]/5 font-semibold text-orange-300">
          Live preview
        </span>
      </div>
      <div className="mt-4 space-y-4">
        {activity.map((item, index) => (
          <article key={item} className="flex gap-x-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-300" />
            <div>
              <p className="text-[0.8125rem]/5 font-medium text-gray-200">
                {item}
              </p>
              <p className="mt-0.5 text-[0.6875rem]/5 text-gray-500">
                {index + 1}h ago / client workspace
              </p>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}

function DashboardSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Overview" title="Hello, Roman">
        <button className="rounded-xl bg-white px-3 py-2 text-[0.8125rem]/5 font-semibold text-gray-950 transition hover:bg-orange-200">
          New project
        </button>
      </SectionHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value="05" detail="2 need review" />
        <StatCard label="Tasks open" value="18" detail="6 due this week" />
        <StatCard label="Portfolio-ready" value="03" detail="Flagged projects" />
        <StatCard label="Pending payments" value="$4.2k" detail="Across 3 projects" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.8fr)]">
        <Panel className="p-4">
          <h2 className="font-display text-base/6 font-semibold text-white">
            Priority projects
          </h2>
          <div className="mt-4 grid gap-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectRow key={project.name} project={project} />
            ))}
          </div>
        </Panel>
        <ActivityLog />
      </div>
    </div>
  )
}

function ProjectRow({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="grid gap-3 rounded-xl border border-white/10 bg-gray-950/35 p-3 sm:grid-cols-[minmax(0,1fr)_8rem_8rem] sm:items-center">
      <div className="min-w-0">
        <p className="truncate text-[0.8125rem]/5 font-semibold text-white">
          {project.name}
        </p>
        <p className="mt-1 text-[0.6875rem]/5 text-gray-500">
          {project.type} / {project.client}
        </p>
      </div>
      <StatusBadge status={project.status} />
      <div>
        <div className="mb-1 flex justify-between text-[0.6875rem]/5 text-gray-500">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} />
      </div>
    </div>
  )
}

function ProjectsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Projects" title="Websites and applications" />
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  )
}

function TaskTable() {
  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="font-display text-base/6 font-semibold text-white">
          Task queue
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[58rem] w-full text-left text-xs/5">
          <thead className="text-[0.6875rem]/5 uppercase tracking-[0.12em] text-gray-500">
            <tr>
              {[
                'Task',
                'Project',
                'Assigned',
                'Due',
                'By',
                'To',
                'Status',
              ].map((head) => (
                <th key={head} className="border-b border-white/10 px-4 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.title} className="border-b border-white/10">
                <td className="px-4 py-3 font-semibold text-white">
                  {task.title}
                </td>
                <td className="px-4 py-3 text-gray-400">{task.project}</td>
                <td className="px-4 py-3 text-gray-500">
                  {task.assignedDate}
                </td>
                <td className="px-4 py-3 text-gray-500">{task.dueDate}</td>
                <td className="px-4 py-3 text-gray-400">{task.assignedBy}</td>
                <td className="px-4 py-3 text-gray-400">{task.assignedTo}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function TasksSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Tasks" title="Assignments and deadlines" />
      <TaskTable />
    </div>
  )
}

function ClientTable() {
  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[56rem] w-full text-left text-xs/5">
          <thead className="text-[0.6875rem]/5 uppercase tracking-[0.12em] text-gray-500">
            <tr>
              {[
                'Client',
                'Company',
                'Email',
                'Project',
                'Status',
                'Last activity',
              ].map((head) => (
                <th key={head} className="border-b border-white/10 px-4 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.email} className="border-b border-white/10">
                <td className="px-4 py-3 font-semibold text-white">
                  {client.name}
                </td>
                <td className="px-4 py-3 text-gray-400">{client.company}</td>
                <td className="px-4 py-3 text-orange-300">{client.email}</td>
                <td className="px-4 py-3 text-gray-400">{client.project}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={client.status} />
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {client.lastActivity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function ClientsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Clients" title="Client users and access" />
      <ClientTable />
    </div>
  )
}

function PortfolioSection() {
  let portfolioProjects = projects.filter((project) => project.portfolio)

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Portfolio" title="Included project stories" />
      <div className="grid gap-4 lg:grid-cols-3">
        {portfolioProjects.map((project) => (
          <Panel key={project.name} className="overflow-hidden">
            <div className="aspect-[16/10] bg-linear-to-br from-orange-400/25 via-amber-300/12 to-gray-950" />
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.6875rem]/5 font-semibold uppercase tracking-[0.12em] text-orange-300">
                  {project.category}
                </p>
                <StatusBadge status="Included" />
              </div>
              <h3 className="mt-3 font-display text-base/6 font-semibold text-white">
                {project.name}
              </h3>
              <p className="mt-2 text-xs/5 text-gray-400">
                {project.description}
              </p>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  )
}

function NotesEditor() {
  return (
    <div className="grid gap-4 xl:grid-cols-[20rem_minmax(0,1fr)]">
      <Panel className="p-4">
        <h2 className="font-display text-base/6 font-semibold text-white">
          Posted notes
        </h2>
        <div className="mt-4 space-y-3">
          {notes.map((note) => (
            <article
              key={note.title}
              className="rounded-xl border border-white/10 bg-gray-950/35 p-3"
            >
              <p className="text-[0.8125rem]/5 font-semibold text-white">
                {note.title}
              </p>
              <p className="mt-1 text-[0.6875rem]/5 text-gray-500">
                {note.date}
              </p>
              <p className="mt-2 text-xs/5 text-gray-400">{note.excerpt}</p>
            </article>
          ))}
        </div>
      </Panel>
      <Panel className="overflow-hidden">
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-[0.8125rem]/5 font-semibold text-white">
            Editor draft
          </p>
        </div>
        <div className="p-4">
          <input
            placeholder="Note title"
            className="w-full bg-transparent font-display text-xl/7 font-semibold text-white placeholder:text-gray-600 focus:outline-hidden"
          />
          <textarea
            rows={14}
            placeholder="Write a project update, internal note, or portfolio draft..."
            className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-gray-950/35 p-4 text-xs/6 text-gray-300 placeholder:text-gray-600 focus:border-orange-300 focus:outline-hidden"
          />
          <div className="mt-4 flex justify-end">
            <button className="rounded-xl bg-white px-3 py-2 text-[0.8125rem]/5 font-semibold text-gray-950 transition hover:bg-orange-200">
              Save draft
            </button>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function NotesSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Notes" title="Writing and project updates" />
      <NotesEditor />
    </div>
  )
}

function FinanceSummary() {
  let totals = projects.reduce(
    (acc, project) => ({
      income: acc.income + project.income,
      expenses: acc.expenses + project.expenses,
      pending: acc.pending + Math.max(project.budget - project.income, 0),
      remaining: acc.remaining + Math.max(project.budget - project.spent, 0),
    }),
    { income: 0, expenses: 0, pending: 0, remaining: 0 },
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total income"
          value={`$${totals.income.toLocaleString()}`}
          detail="Received payments"
        />
        <StatCard
          label="Expenses"
          value={`$${totals.expenses.toLocaleString()}`}
          detail="Tools, assets, services"
        />
        <StatCard
          label="Pending"
          value={`$${totals.pending.toLocaleString()}`}
          detail="Remaining invoices"
        />
        <StatCard
          label="Remaining"
          value={`$${totals.remaining.toLocaleString()}`}
          detail="Budget left"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <Panel key={project.name} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.8125rem]/5 font-semibold text-white">
                  {project.name}
                </p>
                <p className="mt-1 text-[0.6875rem]/5 text-gray-500">
                  Budget ${project.budget.toLocaleString()}
                </p>
              </div>
              <StatusBadge status={project.status} />
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[0.6875rem]/5 text-gray-500">
                <span>Spent</span>
                <span>${project.spent.toLocaleString()}</span>
              </div>
              <ProgressBar value={(project.spent / project.budget) * 100} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs/5">
              <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
                Incoming ${project.income.toLocaleString()}
              </div>
              <div className="rounded-xl bg-rose-400/10 p-3 text-rose-300">
                Outgoing ${project.expenses.toLocaleString()}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  )
}

function FinanceSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Finance" title="Project budgets and cashflow" />
      <FinanceSummary />
    </div>
  )
}

function DashboardContent({ active }: { active: Section }) {
  if (active === 'projects') return <ProjectsSection />
  if (active === 'tasks') return <TasksSection />
  if (active === 'clients') return <ClientsSection />
  if (active === 'portfolio') return <PortfolioSection />
  if (active === 'notes') return <NotesSection />
  if (active === 'finance') return <FinanceSection />

  return <DashboardSection />
}

export default function Dashboard() {
  let [activeSection, setActiveSection] = useState<Section>('dashboard')
  let activeLabel = useMemo(
    () => navItems.find((item) => item.id === activeSection)?.label,
    [activeSection],
  )

  return (
    <main className="min-h-screen bg-gray-950 p-3 text-white sm:p-4">
      <div className="mx-auto grid max-w-7xl gap-3 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <Sidebar active={activeSection} onChange={setActiveSection} />
        <section className="min-w-0">
          <Panel className="min-h-[calc(100vh-2rem)] overflow-hidden">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gray-900/55 px-4 py-3">
              <div className="rounded-xl border border-white/10 bg-gray-950/55 px-3 py-2 text-xs/5 text-gray-500 sm:min-w-80">
                Search or type a command
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-xs/5 font-medium text-gray-500 sm:inline">
                  {activeLabel}
                </span>
                <button className="rounded-xl bg-orange-400 px-3 py-2 text-[0.8125rem]/5 font-semibold text-gray-950 transition hover:bg-orange-300">
                  New project
                </button>
              </div>
            </header>
            <div className="p-4 sm:p-5 lg:p-6">
              <DashboardContent active={activeSection} />
            </div>
          </Panel>
        </section>
      </div>
    </main>
  )
}
