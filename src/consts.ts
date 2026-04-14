// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'arii';
export const SITE_AUTHOR = 'Arian Najafi Yamchelo';
export const SITE_DESCRIPTION = "A developer's log. code, AI, and things worth writing down.";

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

export const BLOG_PAGE_SIZE = 3;

export const categoryHref = (category: string) => `/blog/category/${encodeURIComponent(category)}`;
export const tagHref = (tag: string) => `/blog/tag/${encodeURIComponent(tag)}`;
export const blogPageHref = (page: number) => (page <= 1 ? '/blog' : `/blog/page/${page}`);
export const categoryPageHref = (category: string, page: number) =>
  page <= 1 ? categoryHref(category) : `${categoryHref(category)}/page/${page}`;
export const tagPageHref = (tag: string, page: number) =>
  page <= 1 ? tagHref(tag) : `${tagHref(tag)}/page/${page}`;
