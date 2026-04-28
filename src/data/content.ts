// ── Job status badge ──────────────────────────────────────────────────────────
// Change `available` to false and set `currentRole` when employed.
// The hero badge will switch automatically.
export const jobStatus = {
  available: true,
  availableText: 'Available for SDE2 / Senior Frontend roles',
  // Shown when available: false
  currentRole: 'SDE2 @ Capgemini',
}
// ─────────────────────────────────────────────────────────────────────────────

export const personal = {
  name: 'Aditya Garg',
  title: 'Senior Frontend Developer | SDE2',
  email: 'aditya.garg3198@gmail.com',
  linkedin: 'https://www.linkedin.com/in/adityagarg3198/',
  github: 'https://github.com/aditya3198',
  oldSite: 'https://aditya3198.github.io/',
  location: 'Bangalore, India',
  description:
    'I build performant, accessible, cinematic React interfaces. Currently an SDE2 at Capgemini, shipping reusable Lit web components and shaping frontend architecture.',
}

export const typedRoles = [
  'React Engineer',
  'System Design & Performance',
  'Frontend Developer',
  'SDE-2 · 5+ Years',
  'Frontend Systems Thinker',
]

export const stats = [
  { value: '5+',    label: 'Years exp.' },
  { value: '20+',   label: 'Features shipped' },
  { value: 'SDE-2', label: 'Current level' },
  { value: '2',     label: 'Companies' },
]

export const marqueeSkills = [
  'React.js', 'TypeScript', 'JavaScript', 'Lit', 'Next.js', 'Tailwind CSS',
  'GraphQL', 'REST APIs', 'Jest', 'Vite', 'Azure DevOps', 'Git', 'Python',
  'React Native', 'PWA', 'Micro-frontends', 'Web Components', 'Storybook',
]

export const highlightSkills = [
  { label: 'React.js',      sub: '5 years',    desc: 'Hooks · context · custom libs · optimisation',  glow: '#22d3ee' },
  { label: 'TypeScript',    sub: '5.5 years',  desc: 'Generics · utility types · strict mode',         glow: '#4ade80' },
  { label: 'Lit',           sub: '1 year',     desc: 'Web components · shadow DOM · enterprise',       glow: '#a78bfa' },
  { label: 'Web Perf',      sub: 'Proficient', desc: 'Code splitting · lazy load · Core Web Vitals',   glow: '#f472b6' },
  { label: 'React Native',  sub: '6 months',   desc: 'Cross-platform mobile · Expo · native APIs',     glow: '#fb923c' },
  { label: 'Next.js',       sub: 'Learning',   desc: 'SSR · SSG · App Router · API routes',             glow: '#e2e8f0' },
]

export const experience = [
  {
    role: 'Consultant · SDE2',
    company: 'Capgemini',
    client: 'Standard Chartered Bank',
    period: 'Mar 2025 – Present',
    accent: '#22d3ee',
    points: [
      'Engineered scalable, reusable Lit web components reducing UI duplication across teams',
      'Pioneered PoC eliminating SIT dependency — saving several developer-days per requirement',
      'Shaped long-term frontend architecture through technical design discussions',
      'Reviewed PRs, established coding standards and mentored developers',
      'Integrated REST and GraphQL APIs for efficient client-server communication',
    ],
    tech: ['Lit', 'TypeScript', 'GraphQL', 'Jest', 'Azure DevOps', 'GHCP'],
  },
  {
    role: 'Systems Engineer',
    company: 'Tata Consultancy Services',
    client: null,
    period: 'Oct 2020 – Mar 2025',
    accent: '#4ade80',
    points: [
      'Architected 20+ frontend features including dynamic dashboards for agentic intelligence solutions',
      'Enabled PWA capabilities for a legacy application, improving accessibility and offline usability',
      'Designed component libraries and style guides with micro-frontend architecture',
      'Implemented hooks, HOCs, code splitting, and lazy loading to optimise React applications',
      'Championed Agile practices as Scrum Master, increasing team productivity by 25%',
    ],
    tech: ['React.js', 'TypeScript', 'Python', 'PWA', 'Jest', 'Django', 'Flask'],
  },
] as const

export const projects = [
  {
    name: 'Frontend Interview Prep',
    desc: 'Interactive multi-page learning platform — React, JS, TypeScript, CSS & HTML — with live component playgrounds, edge cases, and interview Q&A.',
    tech: ['Next.js 14', 'TypeScript', 'MDX', 'Tailwind'],
    badge: 'In progress',
    badgeColor: '#fbbf24',
    accent: '#22d3ee',
    liveUrl: null as string | null,
    githubUrl: null as string | null,
  },
  {
    name: 'Portfolio v2',
    desc: 'Designed and built from scratch — dark glassmorphism, cinematic scroll-driven animations, typed hero, and horizontal drag timelines.',
    tech: ['React', 'TypeScript', 'Vite', 'GSAP', 'Framer Motion', 'SCSS'],
    badge: 'Live',
    badgeColor: '#4ade80',
    accent: '#4ade80',
    liveUrl: null as string | null,
    githubUrl: 'https://github.com/aditya3198/Portfolio_v2',
    isCurrent: true,
  },
  {
    name: 'Bicycle Catalog',
    desc: 'Freelance client site for a Toronto-based bicycle shop — product showcase with image hosting, contact form via EmailJS, and a Google Sheets macro-powered user list.',
    tech: ['React', 'Vite', 'EmailJS', 'Google Sheets'],
    badge: 'Freelance - Archived',
    badgeColor: '#fb923c',
    accent: '#fb923c',
    liveUrl: 'https://bicycle-catalog.pages.dev/',
    githubUrl: null as string | null,
  },
  {
    name: 'Portfolio v1',
    desc: 'First personal portfolio — clean layout, project showcase, and contact section. The foundation that led to v2.',
    tech: ['HTML', 'CSS', 'JavaScript','jQuery'],
    badge: 'Archived',
    badgeColor: '#94a3b8',
    accent: '#f472b6',
    liveUrl: 'https://aditya3198.github.io/' as string | null,
    githubUrl: 'https://github.com/aditya3198/aditya3198.github.io' as string | null,
  },
] as const

export const navLinks = [
  { label: 'Skills',     href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Contact',    href: '#contact' },
]
