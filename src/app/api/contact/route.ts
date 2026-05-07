import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

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

  let transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: {
      user: username,
      pass: password,
    },
  })

  await transporter.sendMail({
    from: `rkingg.com <${from}>`,
    to,
    cc,
    replyTo,
    subject: cleanHeaderValue(subject),
    text,
  })
}

export async function POST(request: Request) {
  let payload = (await request.json()) as ContactPayload
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
    console.error(error)

    return Response.json(
      { error: 'Message could not be sent right now.' },
      { status: 500 },
    )
  }
}
