'use client'

import { useId, useState } from 'react'

import { Button } from '@/components/Button'

const CONTACT_ERROR_MESSAGE = 'Message could not be sent right now.'
const CONTACT_REQUEST_TIMEOUT_MS = 12000

const requestTypes = {
  project: {
    label: 'new-project',
    titlePlaceholder: 'What are we building?',
    messagePlaceholder:
      'Tell me about the goal, timeline, pages, references, budget range, or any rough idea you already have.',
  },
  website: {
    label: 'website-refresh',
    titlePlaceholder: 'Which site needs work?',
    messagePlaceholder:
      'Share the current URL, what feels off, what should change, and any launch timing I should know.',
  },
  app: {
    label: 'app-interface',
    titlePlaceholder: 'What should the app help people do?',
    messagePlaceholder:
      'Describe the main users, core screens, workflow pain points, and any data or dashboard needs.',
  },
  collab: {
    label: 'collaboration',
    titlePlaceholder: 'What kind of collaboration?',
    messagePlaceholder:
      'Tell me the role, scope, team setup, timeline, and where you need design or frontend support.',
  },
}

type RequestType = keyof typeof requestTypes
type ContactResponse = {
  error?: string
}

async function readContactError(response: Response) {
  let contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      let data = (await response.json()) as ContactResponse
      return data.error ?? CONTACT_ERROR_MESSAGE
    } catch {
      return CONTACT_ERROR_MESSAGE
    }
  }

  return CONTACT_ERROR_MESSAGE
}

export function SignUpForm() {
  let id = useId()
  let [email, setEmail] = useState('')
  let [title, setTitle] = useState('')
  let [message, setMessage] = useState('')
  let [requestType, setRequestType] = useState<RequestType>('project')
  let [isRequestTypeOpen, setIsRequestTypeOpen] = useState(false)
  let [isOpen, setIsOpen] = useState(false)
  let [status, setStatus] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle')
  let [statusMessage, setStatusMessage] = useState('')
  let selectedRequestType = requestTypes[requestType]

  function openRequestForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsOpen(true)
  }

  async function sendRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setStatusMessage('')

    let controller = new AbortController()
    let timeoutId = setTimeout(
      () => controller.abort(),
      CONTACT_REQUEST_TIMEOUT_MS,
    )

    try {
      let response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          email,
          requestType: selectedRequestType.label,
          title,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error(await readContactError(response))
      }

      setStatus('sent')
      setStatusMessage('Message sent. I will reply soon.')
      setEmail('')
      setTitle('')
      setMessage('')
    } catch (error) {
      setStatus('error')
      setStatusMessage(
        error instanceof DOMException && error.name === 'AbortError'
          ? CONTACT_ERROR_MESSAGE
          : error instanceof Error
            ? error.message
            : CONTACT_ERROR_MESSAGE,
      )
    } finally {
      clearTimeout(timeoutId)
    }
  }

  return (
    <>
      <form
        onSubmit={openRequestForm}
        className="relative isolate mt-8 flex items-center pr-1"
      >
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          readOnly
          type="text"
          name="email"
          id={id}
          value="hello@rkingg.com"
          className="peer w-0 flex-auto cursor-pointer bg-transparent px-4 py-2.5 text-base text-white placeholder:text-gray-500 focus:outline-hidden sm:text-[0.8125rem]/6"
          onFocus={() => setIsOpen(true)}
        />
        <Button type="submit" arrow>
          Message
        </Button>
        <div className="absolute inset-0 -z-10 rounded-lg transition peer-focus:ring-4 peer-focus:ring-orange-300/15" />
        <div className="absolute inset-0 -z-10 rounded-lg bg-white/2.5 ring-1 ring-white/15 transition peer-focus:ring-orange-300" />
      </form>

      {isOpen ? (
        <div className="modal-backdrop-enter fixed inset-0 z-100 flex items-center justify-center bg-gray-950/70 px-4 py-8 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close project request form"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <form
            onSubmit={sendRequest}
            className="modal-panel-enter relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-gray-950 shadow-2xl shadow-orange-950/30"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-gray-900/80 px-5 py-4">
              <div className="flex min-w-0 items-center gap-x-3">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="h-4 w-4 flex-none text-gray-500"
                >
                  <path
                    fill="currentColor"
                    d="M2.75 2A1.75 1.75 0 0 0 1 3.75v8.5C1 13.216 1.784 14 2.75 14h10.5A1.75 1.75 0 0 0 15 12.25v-8.5A1.75 1.75 0 0 0 13.25 2H2.75Zm0 1.5h10.5a.25.25 0 0 1 .25.25v.586L8 7.486 2.5 4.336V3.75a.25.25 0 0 1 .25-.25Zm-.25 2.564 5.128 2.934a.75.75 0 0 0 .744 0L13.5 6.064v6.186a.25.25 0 0 1-.25.25H2.75a.25.25 0 0 1-.25-.25V6.064Z"
                  />
                </svg>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                  className="min-w-0 bg-transparent text-sm/6 font-semibold text-white placeholder:text-gray-500 focus:outline-hidden"
                />
              </div>
              <div className="relative flex items-center gap-x-2 text-sm/6 font-semibold text-gray-300">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="h-4 w-4 text-gray-500"
                >
                  <path
                    fill="currentColor"
                    d="M5.5 3.25a2.25 2.25 0 1 1 3 2.12V7h2.75A2.75 2.75 0 0 1 14 9.75v.88a2.25 2.25 0 1 1-1.5 0v-.88c0-.69-.56-1.25-1.25-1.25H8.5v2.13a2.25 2.25 0 1 1-1.5 0V5.37a2.25 2.25 0 0 1-1.5-2.12Z"
                  />
                </svg>
                <button
                  type="button"
                  aria-expanded={isRequestTypeOpen}
                  aria-haspopup="listbox"
                  className="inline-flex items-center gap-x-1 rounded-md px-1 py-0.5 text-sm/6 font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white focus:outline-hidden"
                  onClick={() => setIsRequestTypeOpen((isOpen) => !isOpen)}
                >
                  {selectedRequestType.label}
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-gray-500"
                  >
                    <path
                      fill="currentColor"
                      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    />
                  </svg>
                </button>
                {isRequestTypeOpen ? (
                  <div
                    role="listbox"
                    className="selector-enter absolute top-full right-0 z-10 mt-2 w-52 overflow-hidden rounded-lg border border-white/10 bg-gray-950/95 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl"
                  >
                    {Object.entries(requestTypes).map(([value, option]) => (
                      <button
                        key={value}
                        type="button"
                        role="option"
                        aria-selected={requestType === value}
                        className={
                          requestType === value
                            ? 'flex w-full items-center justify-between rounded-md bg-orange-400/10 px-3 py-2 text-left text-sm/6 font-semibold text-orange-300 ring-1 ring-orange-400/20'
                            : 'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm/6 font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white'
                        }
                        onClick={() => {
                          setRequestType(value as RequestType)
                          setIsRequestTypeOpen(false)
                        }}
                      >
                        {option.label}
                        {requestType === value ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-300" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="space-y-4 px-5 py-5">
              <input
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={selectedRequestType.titlePlaceholder}
                className="w-full border-l border-orange-300 bg-transparent pl-3 font-display text-xl/8 text-white placeholder:text-gray-500 focus:outline-hidden"
              />
              <textarea
                required
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={selectedRequestType.messagePlaceholder}
                className="w-full resize-none bg-transparent text-sm/6 text-gray-300 placeholder:text-gray-600 focus:outline-hidden"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-gray-900/80 px-5 py-4 text-sm/6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400">
                <span>Reply within 24h</span>
                <span className="text-emerald-300">scope check</span>
                <span className="text-orange-300">next steps</span>
                <span className="flex gap-x-1">
                  <span className="h-3 w-3 rounded-sm bg-amber-300" />
                  <span className="h-3 w-3 rounded-sm bg-teal-300" />
                  <span className="h-3 w-3 rounded-sm bg-orange-300" />
                  <span className="h-3 w-3 rounded-sm bg-rose-400" />
                </span>
              </div>
              <div className="flex items-center gap-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    setStatus('idle')
                    setStatusMessage('')
                  }}
                  className="rounded-md px-3 py-1.5 text-sm/6 font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <Button type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending...' : 'Send'}
                </Button>
              </div>
              {statusMessage ? (
                <p
                  className={
                    status === 'error'
                      ? 'basis-full text-xs/5 font-semibold text-rose-300'
                      : 'basis-full text-xs/5 font-semibold text-emerald-300'
                  }
                >
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </>
  )
}
