import tls from 'node:tls'

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

function dotStuff(value: string) {
  return value.replace(/^\./gm, '..')
}

function encodeBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64')
}

function readResponse(socket: tls.TLSSocket) {
  return new Promise<string>((resolve, reject) => {
    let buffer = ''

    function cleanup() {
      socket.off('data', handleData)
      socket.off('error', reject)
    }

    function handleData(chunk: Buffer) {
      buffer += chunk.toString('utf8')
      let lines = buffer.split(/\r?\n/).filter(Boolean)
      let lastLine = lines.at(-1)

      if (lastLine && /^\d{3} /.test(lastLine)) {
        cleanup()
        resolve(buffer)
      }
    }

    socket.on('data', handleData)
    socket.on('error', reject)
  })
}

async function sendCommand(socket: tls.TLSSocket, command: string) {
  socket.write(`${command}\r\n`)

  return readResponse(socket)
}

function assertOk(response: string, accepted: Array<number>) {
  let code = Number(response.slice(0, 3))

  if (!accepted.includes(code)) {
    throw new Error(`SMTP command failed with ${code}: ${response}`)
  }
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

  if (!host || !username || !password) {
    throw new Error('Missing SMTP environment variables.')
  }

  let socket = tls.connect({
    host,
    port,
    servername: host,
  })

  try {
    assertOk(await readResponse(socket), [220])
    assertOk(await sendCommand(socket, 'EHLO rkingg.com'), [250])
    assertOk(await sendCommand(socket, 'AUTH LOGIN'), [334])
    assertOk(await sendCommand(socket, encodeBase64(username)), [334])
    assertOk(await sendCommand(socket, encodeBase64(password)), [235])
    assertOk(await sendCommand(socket, `MAIL FROM:<${from}>`), [250])
    assertOk(await sendCommand(socket, `RCPT TO:<${to}>`), [250, 251])
    assertOk(await sendCommand(socket, `RCPT TO:<${cc}>`), [250, 251])
    assertOk(await sendCommand(socket, 'DATA'), [354])

    let message = [
      `From: RKINGG// <${from}>`,
      `To: ${to}`,
      `Cc: ${cc}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${cleanHeaderValue(subject)}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      dotStuff(text),
      '.',
    ].join('\r\n')

    assertOk(await sendCommand(socket, message), [250])
    await sendCommand(socket, 'QUIT')
  } finally {
    socket.end()
  }
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

  let subject = `${requestType} - ${title}`
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
