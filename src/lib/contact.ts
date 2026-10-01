import { site } from '@/config/site'

export interface Inquiry {
  name: string
  email: string
  company?: string
  interests: string[]
  budget: string
  message: string
  /** Honeypot — humans never fill this. */
  botcheck?: string
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; /** FormSubmit needs its one-time activation click. */ activation?: boolean }

/** Env vars count only when non-blank: an empty `VAR=` (e.g. pasted from .env.example) means "not set". */
const optionalEnv = (value: string | undefined) => value?.trim() || undefined

const WEB3FORMS_KEY = optionalEnv(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY)
/** Optional FormSubmit alias (from its activation email) so the endpoint doesn't expose the address. */
const FORMSUBMIT_ID = optionalEnv(import.meta.env.VITE_FORMSUBMIT_ID)
const TIMEOUT_MS = 15_000

/* ------------------------------------------------------------------------------------------
 * Web-mail compose links. Used instead of mailto:, which depends on the visitor's OS having a
 * mail app registered — often it's a browser, and the visitor lands on a blank window.
 * ---------------------------------------------------------------------------------------- */

export function gmailCompose(subject = '', body = '') {
  const q = new URLSearchParams({ view: 'cm', fs: '1', to: site.email, su: subject, body })
  return `https://mail.google.com/mail/?${q}`
}

export function outlookCompose(subject = '', body = '') {
  const q = new URLSearchParams({ to: site.email, subject, body })
  return `https://outlook.office.com/mail/deeplink/compose?${q}`
}

/** Subject + body of an inquiry, for pre-filling a web-mail draft if delivery fails. */
export function inquiryDraft(q: Inquiry) {
  const subject = `Project inquiry from ${q.name}${q.company ? ` (${q.company})` : ''}`
  const lines = [`Name: ${q.name}`, `Email: ${q.email}`]
  if (q.company) lines.push(`Company: ${q.company}`)
  if (q.interests.length) lines.push(`Interested in: ${q.interests.join(', ')}`)
  if (q.budget) lines.push(`Budget: ${q.budget}`)
  return { subject, body: [...lines, '', q.message].join('\n') }
}

/* ------------------------------------------------------------------------------------------
 * Delivery — no backend. Web3Forms if a key is configured, otherwise FormSubmit, which needs
 * no key: the first submission emails the inbox owner a one-time "Activate Form" link.
 * ---------------------------------------------------------------------------------------- */

async function post(url: string, payload: Record<string, unknown>) {
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    })
    const json = (await res.json().catch(() => ({}))) as { success?: boolean | string; message?: string }
    return { res, json }
  } finally {
    window.clearTimeout(timer)
  }
}

export async function submitInquiry(q: Inquiry): Promise<SubmitResult> {
  if (q.botcheck) return { ok: true } // silently drop bots

  const fields = {
    name: q.name,
    email: q.email,
    company: q.company ?? '',
    interests: q.interests.join(', '),
    budget: q.budget,
    message: q.message,
  }
  const subject = `New project inquiry — ${q.name}`

  try {
    if (WEB3FORMS_KEY) {
      const { res, json } = await post('https://api.web3forms.com/submit', {
        access_key: WEB3FORMS_KEY,
        subject,
        from_name: `${site.name} — portfolio`,
        replyto: q.email,
        ...fields,
      })
      if (res.ok && json.success === true) return { ok: true }
      return { ok: false, error: json.message ?? `Request failed (${res.status})` }
    }

    const { res, json } = await post(`https://formsubmit.co/ajax/${FORMSUBMIT_ID ?? site.email}`, {
      _subject: subject,
      _replyto: q.email,
      _template: 'table',
      _captcha: 'false',
      ...fields,
    })
    // FormSubmit reports success as the string "true"
    if (res.ok && (json.success === true || json.success === 'true')) return { ok: true }
    const message = json.message ?? `Request failed (${res.status})`
    return { ok: false, error: message, activation: /activat/i.test(message) }
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'AbortError'
    return { ok: false, error: timedOut ? 'The request timed out.' : 'Network error.' }
  }
}
