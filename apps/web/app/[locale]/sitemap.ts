// app/[locale]/sitemap.ts
import fs from "node:fs";
import type { MetadataRoute } from "next";

const appFolders = fs.readdirSync("app", { withFileTypes: true })
  .filter((file) => file.isDirectory())
  .filter((folder) => !folder.name.startsWith("_") && !folder.name.startsWith("("))
  .map((folder) => folder.name);

const sitemap = async (): Promise<MetadataRoute.Sitemap> => [
  {
    url: "/",
    lastModified: new Date(),
  },
  ...appFolders.map((page) => ({
    url: `/${page}`,
    lastModified: new Date(),
  })),
];

export default sitemap;

