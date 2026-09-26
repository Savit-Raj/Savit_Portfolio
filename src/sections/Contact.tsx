import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, Copy, Loader2 } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { socialIcon } from '@/components/ui/BrandIcons'
import { Reveal, RevealLines } from '@/components/ui/Reveal'
import { Accent, Eyebrow } from '@/components/ui/SectionHeader'
import { StatusDot } from '@/components/ui/Tag'
import { site } from '@/config/site'
import { services } from '@/data/services'
import { useLocalTime } from '@/hooks/useLocalTime'
import { gmailCompose, inquiryDraft, outlookCompose, submitInquiry, type Inquiry } from '@/lib/contact'
import { copyToClipboard } from '@/lib/toast'
import { cn } from '@/lib/utils'

const BUDGETS = ['< ₹20k', '₹20k – 40k', '₹40k – 60k', '₹60k +', 'Not sure yet']
const INTERESTS = services.map((s) => s.title)

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface Failure {
  message: string
  activation: boolean
  draft: { subject: string; body: string }
}

export function Contact() {
  const time = useLocalTime(site.timeZone)
  const formId = useId()
  const [interests, setInterests] = useState<string[]>([])
  const [budget, setBudget] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [failure, setFailure] = useState<Failure | null>(null)

  const toggle = (v: string) => setInterests((xs) => (xs.includes(v) ? xs.filter((x) => x !== v) : [...xs, v]))

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const inquiry: Inquiry = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      company: String(data.get('company') ?? '').trim() || undefined,
      message: String(data.get('message') ?? '').trim(),
      botcheck: String(data.get('botcheck') ?? ''),
      interests,
      budget,
    }
    setStatus('sending')
    setFailure(null)
    const result = await submitInquiry(inquiry)
    if (result.ok) {
      setStatus('sent')
      form.reset()
      setInterests([])
      setBudget('')
    } else {
      // Keep what they typed, and offer one-click web-mail drafts pre-filled with it.
      setFailure({ message: result.error, activation: !!result.activation, draft: inquiryDraft(inquiry) })
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/[0.06] py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -top-[140px] left-1/2 h-[800px] w-[1180px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(200_255_61/0.08),transparent)]" />
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="container-page">
        <Eyebrow index="08" label="Start a project" className="mb-8" />
        <h2 className="max-w-5xl text-balance text-[clamp(2.75rem,8vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.05em]">
          <RevealLines lines={['Got a workflow that', <>should <Accent>run itself?</Accent></>]} />
        </h2>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* direct */}
          <Reveal className="flex flex-col gap-10 lg:col-span-4">
            <p className="text-pretty text-lg leading-relaxed text-fog-400">
              Tell me what’s slow, manual or expensive. I’ll reply within 24 hours with how I’d approach it, what it
              might cost, and whether an agent is even the right tool.
            </p>

            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fog-500">Email</p>
              <button
                type="button"
                onClick={() => copyToClipboard(site.email, 'Email copied')}
                className="group flex items-center gap-3 text-left"
                aria-label={`Copy email address ${site.email}`}
              >
                <span className="text-lg text-fog-50 underline decoration-white/20 underline-offset-[6px] transition-colors group-hover:decoration-signal md:text-xl">
                  {site.email}
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-fog-400 transition-colors group-hover:border-signal/50 group-hover:text-signal">
                  <Copy className="size-3.5" />
                </span>
              </button>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-fog-500">
                <span>Click to copy, or write in</span>
                <ComposeLink href={gmailCompose()}>Gmail</ComposeLink>
                <ComposeLink href={outlookCompose()}>Outlook</ComposeLink>
              </p>
            </div>

            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fog-500">Elsewhere</p>
              <ul className="flex flex-col">
                {site.socials.map((s) => {
                  const Icon = socialIcon[s.label as keyof typeof socialIcon]
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center justify-between border-b border-white/[0.08] py-3.5 transition-colors hover:border-white/20"
                      >
                        <span className="flex items-center gap-3 text-fog-200">
                          <Icon className="size-4 text-fog-500 transition-colors group-hover:text-signal" /> {s.label}
                        </span>
                        <span className="flex items-center gap-2 font-mono text-xs text-fog-500">
                          {s.handle}
                          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-fog-500">
              <span className="flex items-center gap-2">
                <StatusDot /> {site.availability.label}
              </span>
              <span>
                {site.location.split(',')[0]} · <span className="text-fog-200">{time}</span> {site.timeZoneLabel}
              </span>
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={0.1} className="lg:col-span-8">
            <form
              onSubmit={onSubmit}
              aria-describedby={`${formId}-status`}
              className="relative rounded-3xl border border-white/10 bg-ink-900/70 p-6 md:p-10"
            >
              <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Your name" name="name" required autoComplete="name" placeholder="Ada Lovelace" />
                <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="ada@company.com" />
                <Field label="Company (optional)" name="company" autoComplete="organization" placeholder="Analytical Engines Ltd." className="md:col-span-2" />
              </div>

              <fieldset className="mt-8">
                <legend className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fog-500">I’m interested in</legend>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((v) => (
                    <Chip key={v} active={interests.includes(v)} onClick={() => toggle(v)}>
                      {v}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fog-500">Budget (INR)</legend>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {BUDGETS.map((b) => (
                    <Chip key={b} role="radio" active={budget === b} onClick={() => setBudget(budget === b ? '' : b)}>
                      {b}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <label className="mt-8 block">
                <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.16em] text-fog-500">Tell me about the workflow</span>
                <textarea
                  name="message"
                  required
                  minLength={20}
                  rows={5}
                  placeholder="What happens today, what should happen instead, and what data is involved…"
                  className="w-full resize-y rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3.5 text-fog-50 outline-none transition-colors placeholder:text-fog-600 focus:border-signal/60"
                />
              </label>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p id={`${formId}-status`} className="min-h-5 font-mono text-xs" aria-live="polite">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={status}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        'inline-flex items-center gap-2',
                        status === 'error' ? 'text-rose' : status === 'idle' ? 'text-fog-600' : 'text-signal',
                      )}
                    >
                      {status === 'idle' && 'No spam, no newsletter. Just a reply from me.'}
                      {status === 'sending' && 'Sending…'}
                      {status === 'sent' && (
                        <>
                          <Check className="size-3.5" /> Got it. I’ll be in touch within 24h.
                        </>
                      )}
                      {status === 'error' && (failure?.activation ? 'Almost ready: this form needs a one-time activation.' : 'Couldn’t send that.')}
                    </motion.span>
                  </AnimatePresence>
                </p>
                <Button
                  type="submit"
                  size="lg"
                  magnetic
                  disabled={status === 'sending'}
                  icon={status === 'sending' ? <Loader2 className="size-4 animate-spin" /> : <ArrowUpRight className="size-4" />}
                >
                  Send inquiry
                </Button>
              </div>

              <AnimatePresence>
                {status === 'error' && failure && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div role="alert" className="mt-6 rounded-2xl border border-rose/30 bg-rose/[0.06] p-5 text-sm">
                      <p className="text-pretty leading-relaxed text-fog-200">
                        {failure.activation
                          ? 'The form service is waiting for the site owner to confirm it. Nothing you typed is lost.'
                          : `The message didn’t go through (${failure.message.replace(/\.$/, '')}). Nothing you typed is lost.`}{' '}
                        Send it with one click instead. It opens a draft with everything pre-filled:
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button href={gmailCompose(failure.draft.subject, failure.draft.body)} external size="sm" icon={<ArrowUpRight className="size-3.5" />}>
                          Send via Gmail
                        </Button>
                        <Button href={outlookCompose(failure.draft.subject, failure.draft.body)} external size="sm" variant="ghost" icon={<ArrowUpRight className="size-3.5" />}>
                          Send via Outlook
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.email, 'Email copied')} icon={<Copy className="size-3.5" />}>
                          Copy my email
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ComposeLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1 text-fog-400 transition-colors hover:text-signal"
    >
      {children}
      <ArrowUpRight className="size-3" />
    </a>
  )
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
}

function Field({ label, className, ...input }: FieldProps) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.16em] text-fog-500">{label}</span>
      <input
        {...input}
        className="h-12 w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 text-fog-50 outline-none transition-colors placeholder:text-fog-600 focus:border-signal/60"
      />
    </label>
  )
}

function Chip({
  active,
  children,
  onClick,
  role,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
  role?: 'radio'
}) {
  return (
    <button
      type="button"
      role={role}
      aria-pressed={role ? undefined : active}
      aria-checked={role ? active : undefined}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-2 text-[13px] transition-all duration-300',
        active
          ? 'border-signal bg-signal text-ink-950'
          : 'border-white/10 text-fog-400 hover:border-white/25 hover:text-fog-50',
      )}
    >
      {children}
    </button>
  )
}
