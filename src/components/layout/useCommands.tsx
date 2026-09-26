import {
  ArrowUpRight,
  Briefcase,
  Compass,
  FileText,
  Hammer,
  Home,
  Layers,
  Mail,
  Play,
  Route,
  Sparkles,
  Copy,
  User,
} from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/BrandIcons'
import { site, type SectionId } from '@/config/site'
import { gmailCompose, outlookCompose } from '@/lib/contact'
import { copyToClipboard } from '@/lib/toast'
import { useSmoothScroll } from '@/providers/SmoothScroll'

export interface Command {
  id: string
  label: string
  group: 'Navigate' | 'Actions' | 'Elsewhere'
  icon: ReactNode
  keywords?: string
  hint?: string
  run: () => void
}

const open = (href: string) => window.open(href, '_blank', 'noopener,noreferrer')

export function useCommands(): Command[] {
  const { scrollTo } = useSmoothScroll()

  return useMemo(() => {
    const go = (id: SectionId) => () => scrollTo(id === 'top' ? 0 : `#${id}`)
    const icon = 'size-4'
    const list: Command[] = [
      { id: 'top', group: 'Navigate', label: 'Home', icon: <Home className={icon} />, run: go('top') },
      { id: 'flagship', group: 'Navigate', label: 'Flagship: Agentic RAG at EY', icon: <Sparkles className={icon} />, keywords: 'case study ey tax', run: go('flagship') },
      { id: 'playbook', group: 'Navigate', label: 'The playbook — six pillars', icon: <Compass className={icon} />, keywords: 'retrieval memory orchestration', run: go('playbook') },
      { id: 'work', group: 'Navigate', label: 'Selected work', icon: <Briefcase className={icon} />, keywords: 'projects portfolio', run: go('work') },
      { id: 'services', group: 'Navigate', label: 'Services', icon: <Hammer className={icon} />, keywords: 'hire freelance offer', run: go('services') },
      { id: 'process', group: 'Navigate', label: 'Process', icon: <Route className={icon} />, run: go('process') },
      { id: 'journey', group: 'Navigate', label: 'About & experience', icon: <User className={icon} />, keywords: 'resume cv ey pitrade', run: go('journey') },
      { id: 'stack', group: 'Navigate', label: 'Toolbox', icon: <Layers className={icon} />, keywords: 'stack skills tech', run: go('stack') },
      { id: 'contact', group: 'Navigate', label: 'Start a project', icon: <Mail className={icon} />, keywords: 'contact hire email', run: go('contact') },

      { id: 'copy-email', group: 'Actions', label: 'Copy email address', hint: site.email, icon: <Copy className={icon} />, run: () => copyToClipboard(site.email, 'Email copied') },
      // Web-mail compose links instead of mailto: — mailto depends on the OS having a mail app
      // registered, and when a browser is registered instead the visitor gets a blank window.
      { id: 'gmail', group: 'Actions', label: 'Email me via Gmail', hint: 'opens a draft', icon: <Mail className={icon} />, keywords: 'send email mail compose', run: () => open(gmailCompose()) },
      { id: 'outlook', group: 'Actions', label: 'Email me via Outlook', hint: 'opens a draft', icon: <Mail className={icon} />, keywords: 'send email mail compose office', run: () => open(outlookCompose()) },

      { id: 'linkedin', group: 'Elsewhere', label: 'LinkedIn', hint: 'in/savit-raj', icon: <LinkedInIcon className={icon} />, run: () => open(site.socials[0].href) },
      { id: 'github', group: 'Elsewhere', label: 'GitHub', hint: '@Savit-Raj', icon: <GitHubIcon className={icon} />, run: () => open(site.socials[1].href) },
      { id: 'movi-demo', group: 'Elsewhere', label: 'Watch the Movi agent demo', icon: <Play className={icon} />, keywords: 'loom video langgraph', run: () => open('https://www.loom.com/share/2904adafe85e4a79a4ae981de8550725') },
      { id: 'talentflow', group: 'Elsewhere', label: 'Open TalentFlow (live)', icon: <ArrowUpRight className={icon} />, run: () => open('https://talentflowsavit.vercel.app/') },
    ]
    if (site.resumeUrl) {
      const url = site.resumeUrl
      list.push({ id: 'resume', group: 'Actions', label: 'Download résumé', icon: <FileText className={icon} />, keywords: 'cv pdf', run: () => open(url) })
    }
    return list
  }, [scrollTo])
}
