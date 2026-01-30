"use server";

import { prisma as database } from "@repo/database/prisma/prisma";

export type SearchResults = {
  tracks: { 
    id: number; 
    merkleLeaf: string | null;
    title: string; 
    slug: string | null; 
    artistName: string; 
    verificationStatus: string | null 
  }[];
  artists: { 
    id: number; 
    name: string; 
    slug: string; 
    verificationStatus: string | null 
  }[];
};

export async function searchGlobal(query: string): Promise<SearchResults> {
  const cleanQuery = query.trim();
  
  // LOG 1: Check what the server actually receives
  console.log(`🔍 Search started for: "${cleanQuery}"`);

  if (!cleanQuery || cleanQuery.length < 2) {
    console.log("⚠️ Search aborted: Query too short.");
    return { tracks: [], artists: [] };
  }

  try {
    // LOG 2: Validate DB URL is present (helps find Vercel config issues)
    if (!process.env.DATABASE_URL) {
      console.error("❌ ERROR: DATABASE_URL is undefined in the environment!");
    }

    const [tracks, artists] = await Promise.all([
      database.track.findMany({
        where: {
          OR: [
            { title: { contains: cleanQuery, mode: "insensitive" } },
            { merkleLeaf: { contains: cleanQuery, mode: "insensitive" } },
            { 
              artists: { 
                some: { 
                  artist: { name: { contains: cleanQuery, mode: "insensitive" } }
                } 
              } 
            }
          ]
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          isVerified: true,
          merkleLeaf: true, 
          artists: {
            take: 1,
            where: { role: "MAIN" },
            select: { artist: { select: { name: true } } },
          },
        },
      }),
      database.artist.findMany({
        where: { name: { contains: cleanQuery, mode: "insensitive" } },
        take: 5,
        select: { id: true, name: true, slug: true },
      }),
    ]);

    // LOG 3: Check raw counts before formatting
    console.log(`✅ DB Response: Found ${tracks.length} tracks and ${artists.length} artists.`);

    const formattedTracks = tracks.map((t: any) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      merkleLeaf: t.merkleLeaf,
      artistName: t.artists[0]?.artist.name ?? "Unknown Artist",
      verificationStatus: t.isVerified ? "VERIFIED" : "UNVERIFIED", 
    }));

    const formattedArtists = artists.map((a: any) => ({
      ...a,
      verificationStatus: null, 
    }));

    return { tracks: formattedTracks, artists: formattedArtists };
  } catch (error) {
    // LOG 4: Full error details (Crucial for db.prisma.io issues)
    console.error("❌ Search Execution Failed!");
    if (error instanceof Error) {
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      // This will show if it's a P1001 (Connection) or P2021 (Table missing)
    }
    return { tracks: [], artists: [] };
  }
}