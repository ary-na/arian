// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'arii.dev';
export const SITE_TAGLINE = "Arian's Dev Blog";
export const SITE_AUTHOR = 'Arian Najafi Yamchelo';
export const SITE_DESCRIPTION =
  "A developer's log — code, AI, and things worth writing down.";

export type NavItem = {
  href: string;
  label: string;
  description?: string;
};

export const PRIMARY_NAV: NavItem[] = [
  { href: '/', label: 'Home', description: 'start here' },
  { href: '/blog', label: 'Blog', description: 'things i write about' },
  { href: '/about', label: 'About', description: 'who i am' },
];

export const BLOG_PAGE_SIZE = 8;

export type ShippedItem = {
  href: string;
  name: string;
  description: string;
  tag: string;
};

export const SHIPPED: ShippedItem[] = [
  {
    href: '/blog/lazy-commit',
    name: 'lazy-commit',
    description: 'AI-powered conventional commit message generator',
    tag: 'cli · typescript',
  },
  {
    href: '/blog/lstage',
    name: 'lstage',
    description: 'Stage and unstage git files by number, no paths needed',
    tag: 'cli · typescript',
  },
  {
    href: '/blog/syncback',
    name: 'syncback',
    description: 'Merge branches, push, and switch back in one command',
    tag: 'cli · typescript',
  },
  {
    href: '/blog/dtm',
    name: 'dtm',
    description: 'Auto-snapshots your dotfiles and pushes them to GitHub',
    tag: 'cli · typescript',
  },
];

export type SocialLink = {
  href: string;
  label: string;
  handle: string;
  icon?: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { href: 'https://github.com/ary-na', label: 'github', handle: 'ary-na', icon: 'github' },
  { href: 'https://x.com/ariiii4n', label: 'x / twitter', handle: '@ariiii4n', icon: 'x' },
  {
    href: 'https://linkedin.com/in/arian-najafi-yamchelo',
    label: 'linkedin',
    handle: 'arian-najafi-yamchelo',
    icon: 'linkedin',
  },
  {
    href: 'https://gravatar.com/collectiveautomaticae806d67f2',
    label: 'gravatar',
    handle: 'collectiveautomaticae806d67f2',
    icon: 'gravatar',
  },
  { href: 'mailto:hi@arii.dev', label: 'email', handle: 'hi@arii.dev' },
];

export type TechItem = {
  name: string;
  icon: string;
};

export const TECH_STACK: TechItem[] = [
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Python', icon: 'python' },
  { name: 'Swift', icon: 'swift' },
  { name: 'Kotlin', icon: 'kotlin' },
  { name: 'React', icon: 'react' },
  { name: 'Node.js', icon: 'nodedotjs' },
  { name: 'Tailwind', icon: 'tailwindcss' },
  { name: 'Astro', icon: 'astro' },
  { name: 'Flask', icon: 'flask' },
  { name: 'PyTorch', icon: 'pytorch' },
  { name: 'C++', icon: 'cplusplus' },
];

export const categoryHref = (category: string) =>
  `/blog/category/${encodeURIComponent(category)}`;
export const tagHref = (tag: string) => `/blog/tag/${encodeURIComponent(tag)}`;
export const blogPageHref = (page: number) =>
  page <= 1 ? '/blog' : `/blog/page/${page}`;
export const categoryPageHref = (category: string, page: number) =>
  page <= 1 ? categoryHref(category) : `${categoryHref(category)}/page/${page}`;
export const tagPageHref = (tag: string, page: number) =>
  page <= 1 ? tagHref(tag) : `${tagHref(tag)}/page/${page}`;
