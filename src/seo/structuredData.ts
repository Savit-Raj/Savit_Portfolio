import { site } from '@/config/site'
import { education } from '@/data/journey'
import { projects } from '@/data/projects'

/**
 * schema.org JSON-LD for the home page: WebSite + ProfilePage + Person + the showcased projects.
 * ProfilePage/Person is what lets search engines show a proper result for a name search.
 * Injected into the pre-rendered HTML at build time (scripts/prerender.mjs).
 */
export function structuredData(dateModified: string) {
  const home = `${site.url}/`
  const [givenName, ...rest] = site.name.split(' ')
  const personId = `${home}#person`

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    givenName,
    familyName: rest.join(' '),
    alternateName: [givenName, site.name.replace(/\s+/g, '').toLowerCase()],
    description: site.description,
    jobTitle: site.role,
    url: home,
    ...(site.photo ? { image: site.photo } : {}),
    email: `mailto:${site.email}`,
    worksFor: { '@type': 'Organization', name: site.company },
    alumniOf: { '@type': 'CollegeOrUniversity', name: education.school },
    address: { '@type': 'PostalAddress', addressLocality: site.location.split(',')[0].trim(), addressCountry: 'IN' },
    knowsAbout: site.expertise,
    sameAs: site.socials.map((s) => s.href),
  }

  const works = projects
    .filter((p) => !p.hidden)
    .map((p) => ({
      '@type': 'CreativeWork',
      '@id': `${home}#${p.slug}`,
      name: p.title,
      description: p.summary,
      keywords: p.stack.join(', '),
      ...(p.links[0] ? { url: p.links[0].href } : {}),
      creator: { '@id': personId },
    }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${home}#website`,
        url: home,
        name: site.name,
        description: site.description,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${home}#profile`,
        url: home,
        name: `${site.name} — ${site.role}`,
        isPartOf: { '@id': `${home}#website` },
        dateModified,
        mainEntity: { '@id': personId },
        hasPart: works.map((w) => ({ '@id': w['@id'] })),
      },
      person,
      ...works,
    ],
  }
}
