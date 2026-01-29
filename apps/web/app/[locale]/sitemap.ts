import fs from "node:fs";
import { blog, legal } from "@repo/cms";
import type { MetadataRoute } from "next";
import { env } from "@/env";

// Read app folders safely
const appFolders = fs.readdirSync("app", { withFileTypes: true });
const pages = appFolders
  .filter((file) => file.isDirectory())
  .filter((folder) => !folder.name.startsWith("_"))
  .filter((folder) => !folder.name.startsWith("("))
  .map((folder) => folder.name);

const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("https")
  ? "https"
  : "http";

const baseUrl = new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`);

// Safe fetch wrapper for CMS posts
async function safeGetPosts(getPostsFn: () => Promise<{ _slug: string }[]>) {
  try {
    return (await getPostsFn()).map((post) => post._slug);
  } catch (err) {
    console.warn("Failed to fetch posts:", err);
    return [];
  }
}

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const blogs = await safeGetPosts(blog.getPosts);
  const legals = await safeGetPosts(legal.getPosts);

  const pageUrls = pages.map((page) => ({
    url: new URL(`${page}/`, baseUrl).href,
    lastModified: new Date(),
  }));

  const blogUrls = blogs.map((slug) => ({
    url: new URL(`blog/${slug}/`, baseUrl).href,
    lastModified: new Date(),
  }));

  const legalUrls = legals.map((slug) => ({
    url: new URL(`legal/${slug}/`, baseUrl).href,
    lastModified: new Date(),
  }));

  return [
    {
      url: new URL("/", baseUrl).href,
      lastModified: new Date(),
    },
    ...pageUrls,
    ...blogUrls,
    ...legalUrls,
  ];
};

export default sitemap;
