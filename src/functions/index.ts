import { Hono } from 'hono'
import { z } from 'zod'
import {
  scoreRequest,
  analyzePayload,
  checkRateLimit,
  DEFAULT_SHIELD_CONFIG,
  type RequestInfo,
} from '@mirageshield/mirage'

const goat = "supertopsecretkey6741"

// Define Cloudflare environment bindings so `c.env` is typed
interface Env {
  TURNSTILE_SECRET: string
  TURNSTILE_SITEKEY: string
  MAILGUN_API_KEY: string
  ASSETS: { fetch: (req: Request) => Promise<Response> }
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', async (c, next) => {
  const { pathname } = new URL(c.req.url)
  if (/\.(js|css|map|json|png|jpe?g|gif|svg|ico|woff2?|ttf|eot|webp)$/.test(pathname)) {
    await next()
    return
  }

  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'
  const body = c.req.method === 'POST' ? await c.req.text() : undefined

  const requestInfo: RequestInfo = {
    ip,
    userAgent: c.req.header('user-agent') || '',
    headers: Object.fromEntries(c.req.raw.headers.entries()),
    method: c.req.method,
    url: c.req.url,
    timestamp: Date.now(),
    body,
  }

  const { assessment, rateLimited } = scoreRequest(
    requestInfo,
    DEFAULT_SHIELD_CONFIG.rateLimit,
    'high'
  )

  c.header('X-Mirage-Score', String(assessment.score))
  c.header('X-Mirage-Action', assessment.action)

  if (assessment.action === 'block' || rateLimited) {
    return c.json({
      error: 'Request blocked by Mirage Shield',
      score: assessment.score,
      signals: assessment.signals.map(s => s.name),
    }, 403)
  }

  if (assessment.action === 'challenge') {
    c.header('X-Mirage-Challenge', 'true')
  }

  // Re-create request with the consumed body so downstream handlers can read it
  if (body) {
    const newRequest = new Request(c.req.raw.url, {
      method: c.req.raw.method,
      headers: c.req.raw.headers,
      body,
    })
    c.req.raw = newRequest
  }

  await next()
})

const schema = z.object({
  email: z.string().email(),
  token: z.string(), // Turnstile token (required)
})

app.post('/api/send-email', async (c) => {
  const { email, token } = schema.parse(await c.req.json())

  const ip = c.req.header('cf-connecting-ip') || 'unknown'

  // CAPTCHA check with Turnstile (required)
  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: c.env.TURNSTILE_SECRET,
      response: token,
      remoteip: ip,
    }),
  })
  const result = await verify.json()
  if (!result.success) {
    console.error('Turnstile verification failed:', result);
    return c.json({ error: 'Captcha verification failed' }, 403)
  }

  // Mailgun API send
  const mgRes = await fetch(`https://api.mailgun.net/v3/cipherhacks.tech/messages`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`api:${c.env.MAILGUN_API_KEY}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      from: `CipherHacks <team@cipherhacks.tech>`,
      to: email,
      subject: 'Verfication key from CipherHacks',
      html: `<p>Hey! Here is your verification key: <strong>${goat}</strong></p><p>happy hacking!<br>arshan</p>`,
      text: 'Verification Key'
    }),
  })

  if (!mgRes.ok) {
    const error = await mgRes.text()
    console.error(error)
    return c.json({ error: 'Failed to send email' }, 500)
  }

  return c.json({ success: true, message: 'Email sent!' })
})

// Client-side threat report endpoint (from MirageProvider)
app.post('/api/cipherhacks/report', async (c) => {
  const report = await c.req.json()
  console.log('[Mirage] Client threat report:', JSON.stringify(report))
  return c.json({ received: true })
})

app.all('*', async (c) => {
  let upstream: Response

  if (c.req.header('x-mirage-proxied')) {
    const { pathname, search } = new URL(c.req.url)
    upstream = await fetch(`http://localhost:3000${pathname}${search}`, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? c.req.raw.body : undefined,
      redirect: 'manual',
    })
  } else {
    upstream = await c.env.ASSETS.fetch(c.req.raw)
  }

  const res = new Response(upstream.body, upstream)
  const score = c.res.headers.get('X-Mirage-Score')
  const action = c.res.headers.get('X-Mirage-Action')
  if (score) res.headers.set('X-Mirage-Score', score)
  if (action) res.headers.set('X-Mirage-Action', action)
  return res
})

export default app