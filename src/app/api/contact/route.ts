import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const SMTP_TIMEOUT_MS = 9000
const CONTACT_ERROR_MESSAGE = 'Message could not be sent right now.'
const CONTACT_SAVE_ERROR_MESSAGE = 'Message could not be saved right now.'
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_SUBMISSIONS = 3

const contactRateLimit = new Map<
  string,
  {
    count: number
    resetAt: number
  }
>()

type ContactPayload = {
  email?: string
  requestType?: string
  title?: string
  message?: string
  companyWebsite?: string
}

export function GET() {
  return Response.json({ ok: true, service: 'contact' })
}

function cleanHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

function logContactEvent(
  event:
    | 'API route started'
    | 'Supabase insert started'
    | 'Supabase insert success'
    | 'Supabase insert failure'
    | 'Rate limit exceeded'
    | 'Honeypot matched'
    | 'SMTP send started'
    | 'SMTP send success'
    | 'SMTP timeout'
    | 'SMTP failure',
  details: Record<string, unknown> = {},
) {
  console.info('[contact]', event, {
    timestamp: new Date().toISOString(),
    ...details,
  })
}

function isTimeoutError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === 'TimeoutError' || error.message === 'SMTP_SEND_TIMEOUT')
  )
}

function timeoutError() {
  let error = new Error('SMTP_SEND_TIMEOUT')
  error.name = 'TimeoutError'
  return error
}

function getRequestIp(request: Request) {
  let forwardedFor = request.headers.get('x-forwarded-for')
  let realIp = request.headers.get('x-real-ip')

  return cleanHeaderValue(
    forwardedFor?.split(',')[0] ?? realIp ?? 'unknown',
  )
}

function isRateLimited(ip: string) {
  let now = Date.now()
  let current = contactRateLimit.get(ip)

  if (!current || current.resetAt <= now) {
    contactRateLimit.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })

    return false
  }

  if (current.count >= RATE_LIMIT_MAX_SUBMISSIONS) {
    return true
  }

  current.count += 1
  return false
}

async function saveContactMessage({
  email,
  requestType,
  title,
  message,
}: {
  email: string
  requestType: string
  title: string
  message: string
}) {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables.')
  }

  logContactEvent('Supabase insert started')

  let supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  let { error } = await supabase.from('contact_messages').insert({
    email,
    request_type: requestType,
    title,
    message,
    status: 'new',
  })

  if (error) {
    throw error
  }

  logContactEvent('Supabase insert success')
}

async function sendMail({
  from,
  to,
  cc,
  replyTo,
  subject,
  text,
}: {
  from: string
  to: string
  cc: string
  replyTo: string
  subject: string
  text: string
}) {
  let host = process.env.SMTP_HOST
  let port = Number(process.env.SMTP_PORT ?? 465)
  let username = process.env.SMTP_USERNAME
  let password = process.env.SMTP_PASSWORD

  if (!host || !port || !username || !password) {
    throw new Error('Missing SMTP environment variables.')
  }

  logContactEvent('SMTP send started', {
    host,
    port,
    secure: true,
    to,
    cc: Boolean(cc),
  })

  let transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
    auth: {
      user: username,
      pass: password,
    },
  })

  let timeoutId: ReturnType<typeof setTimeout> | undefined

  try {
    await Promise.race([
      transporter.sendMail({
        from: `rkingg.com <${from}>`,
        to,
        cc,
        replyTo,
        subject: cleanHeaderValue(subject),
        text,
      }),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(timeoutError()), SMTP_TIMEOUT_MS)
      }),
    ])

    logContactEvent('SMTP send success', { to })
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    transporter.close()
  }
}

export async function POST(request: Request) {
  logContactEvent('API route started')
  let ip = getRequestIp(request)

  let payload: ContactPayload

  try {
    payload = (await request.json()) as ContactPayload
  } catch (error) {
    console.error('[contact] Invalid JSON payload', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    })

    return Response.json(
      { error: 'Please send a valid message request.' },
      { status: 400 },
    )
  }

  let email = cleanHeaderValue(payload.email ?? '')
  let requestType = cleanHeaderValue(payload.requestType ?? '')
  let title = cleanHeaderValue(payload.title ?? '')
  let message = String(payload.message ?? '').trim()
  let companyWebsite = String(payload.companyWebsite ?? '').trim()

  if (companyWebsite) {
    logContactEvent('Honeypot matched', { ip })
    return Response.json({ ok: true })
  }

  if (isRateLimited(ip)) {
    logContactEvent('Rate limit exceeded', { ip })
    return Response.json(
      { error: 'Too many messages. Please try again later.' },
      { status: 429 },
    )
  }

  if (!email || !requestType || !title || !message) {
    return Response.json(
      { error: 'Please complete all required fields.' },
      { status: 400 },
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  try {
    await saveContactMessage({
      email,
      requestType,
      title,
      message,
    })
  } catch (error) {
    logContactEvent('Supabase insert failure', {
      error: error instanceof Error ? error.message : String(error),
    })

    return Response.json(
      { error: CONTACT_SAVE_ERROR_MESSAGE },
      { status: 500 },
    )
  }

  let now = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'long',
    timeZone: 'Asia/Manila',
  }).format(new Date())

  let subject = ` [${requestType}] - ${title}`
  let text = [
    message,
    '',
    `From: ${email}`,
    `Time and date: ${now}`,
  ].join('\n')

  try {
    await sendMail({
      from: process.env.SMTP_FROM ?? 'no-reply@rkingg.com',
      to: process.env.CONTACT_TO ?? 'hello@rkingg.com',
      cc: process.env.CONTACT_CC ?? 'romkinggarcia@gmail.com',
      replyTo: email,
      subject,
      text,
    })

    return Response.json({ ok: true })
  } catch (error) {
    if (isTimeoutError(error)) {
      logContactEvent('SMTP timeout', { timeoutMs: SMTP_TIMEOUT_MS })
    } else {
      logContactEvent('SMTP failure', {
        error: error instanceof Error ? error.message : String(error),
      })
    }

    return Response.json(
      { error: CONTACT_ERROR_MESSAGE },
      { status: 500 },
    )
  }
}
