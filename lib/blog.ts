/**
 * Lecture des articles MDX stockés dans content/blog.
 * Chaque fichier .mdx commence par un en-tête (frontmatter) décrit par ArticleFrontmatter.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface ArticleFrontmatter {
  title: string;
  description: string;
  /** Date de publication, format AAAA-MM-JJ */
  date: string;
  /** Date de mise à jour (facultatif) */
  updated?: string;
  category: string;
  /** Outil associé (maillage interne) */
  tool?: { href: string; label: string };
  /** Clés de produits affiliés affichés en fin d'article */
  products?: string[];
  /** Étapes HowTo (active les données structurées HowTo pour les guides) */
  howTo?: { name: string; steps: string[] };
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  /** Contenu MDX brut (sans l'en-tête) */
  content: string;
  /** Temps de lecture estimé (minutes) */
  readingMinutes: number;
  /** Nombre de mots */
  words: number;
}

function readArticle(fileName: string): Article {
  const slug = fileName.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as ArticleFrontmatter;
  // gray-matter convertit les dates YAML en objets Date : on les normalise en texte
  const toIso = (d: unknown) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));
  const words = content
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return {
    ...fm,
    date: toIso(fm.date),
    updated: fm.updated ? toIso(fm.updated) : undefined,
    slug,
    content,
    words,
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

/** Tous les articles, du plus récent au plus ancien */
export function getAllArticles(): Article[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readArticle)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title, "fr")));
}

export function getArticle(slug: string): Article | undefined {
  const file = `${slug}.mdx`;
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(path.join(BLOG_DIR, file))) return undefined;
  return readArticle(file);
}

/** Date lisible en français : "12 mars 2026" */
export function formatDateFr(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
