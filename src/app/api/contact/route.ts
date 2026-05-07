import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

const SMTP_TIMEOUT_MS = 9000
const CONTACT_ERROR_MESSAGE = 'Message could not be sent right now.'

type ContactPayload = {
  email?: string
  requestType?: string
  title?: string
  message?: string
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
