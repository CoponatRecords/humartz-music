"use server";

import { prisma as database } from "@repo/database";

export type SearchResults = {
  tracks: { 
    id: number; 
    folderHash: string | null;
    txHash: string | null;
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

  if (!cleanQuery || cleanQuery.length < 2) {
    return { tracks: [], artists: [] };
  }

  try {
    const [tracks, artists] = await Promise.all([
      database.track.findMany({
        where: {
          OR: [
            { title: { contains: cleanQuery, mode: "insensitive" } },
            { folderHash: { contains: cleanQuery, mode: "insensitive" } },
            { txHash: { contains: cleanQuery, mode: "insensitive" } },

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

    const formattedTracks = tracks.map((t: any) => {
      // Normalize the string for comparison
      const rawValue = (t.isVerified || "").trim().toLowerCase();
      
      let status: string | null = null; 

      if (rawValue === "true" || rawValue === "yes" || rawValue === "verified") {
        status = "yes"; // Green
      } else if (rawValue === "false" || rawValue === "no" || rawValue === "ai") {
        status = "no";  // Red
      } else {
        status = null;  // Orange (Pending)
      }

      return {
        id: t.id,
        title: t.title,
        slug: t.slug,
        txHash: t.txHash,
        folderHash: t.folderHash,
        artistName: t.artists[0]?.artist.name ?? "Unknown Artist",
        verificationStatus: status, 
      };
    });

    return { 
      tracks: formattedTracks, 
      artists: artists.map((a: any) => ({ ...a, verificationStatus: null })) 
    };
  } catch (error) {
    console.error("❌ Search Execution Failed!", error);
    return { tracks: [], artists: [] };
  }
}