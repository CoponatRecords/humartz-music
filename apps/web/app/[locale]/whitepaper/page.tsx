import { cn } from "@repo/design-system/lib/utils";
import { getDictionary } from "@repo/internationalization";
import type { Article, WithContext } from "@repo/seo/json-ld";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ShieldCheck, Database, Fingerprint } from "lucide-react";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  // You can add specific metadata to your dictionary later
  return createMetadata({
    title: "Humartz White Paper | Proof of Humanity Protocol",
    description: "The technical documentation for the Humartz cryptographic verification protocol.",
  });
};

const WhitePaperPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  
  // JSON-LD for an Article/TechArticle
  const jsonLd: WithContext<Article> = {
    "@type": "Article",
    "@context": "https://schema.org",
    headline: "Humartz White Paper: Proof of Humanity Protocol",
    author: {
        "@type": "Organization",
        name: "Humartz"
    },
    datePublished: "2026-01-23",
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <div className="w-full py-20 lg:py-32">
        <div className="container mx-auto flex flex-col gap-14 max-w-4xl px-6">
          
          {/* Header Section */}
          <div className="flex flex-col gap-6">
             <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
             </Link>
            <div className="flex flex-col gap-4">
                <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground w-fit">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Version 1.0 — January 2026
                </div>
                <h1 className="font-regular text-4xl tracking-tighter md:text-6xl">
                The Humartz Protocol
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Establishing a decentralized, cryptographic standard for proving human origin in the age of generative AI.
                </p>
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Content Section */}
          <article className="prose prose-stone dark:prose-invert max-w-none">
            
            {/* 1. Abstract */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold tracking-tight mb-4">1. Abstract</h2>
                <p className="text-muted-foreground leading-7">
                We are entering the age of infinite content. Generative AI allows for the instant creation of millions of songs that mimic human creativity. While impressive, this flood creates a crisis of provenance: <strong>How do we know what is actually made by a human?</strong>
                </p>
                <p className="text-muted-foreground leading-7 mt-4">
                Humartz is a protocol designed to solve this crisis. We are building a transparent, cryptographically verifiable registry of human-created content. By leveraging <strong>Merkle Tree cryptography</strong>, Humartz provides a tamper-proof "Seal of Humanity" that allows platforms, listeners, and collectors to mathematically verify the human origin of a piece of content, independent of central authority.
                </p>
            </section>

            {/* 2. The Problem */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold tracking-tight mb-4">2. The Crisis: Dilution of Creativity</h2>
                <div className="grid gap-6 md:grid-cols-2 mt-6">
                    <div className="rounded-lg border p-6 bg-muted/20">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                            <Database className="w-4 h-4 text-orange-500" /> The Flood
                        </h3>
                        <p className="text-sm text-muted-foreground">AI agents can generate 10,000 tracks a day, drowning out human artists and collapsing the discovery layer.</p>
                    </div>
                    <div className="rounded-lg border p-6 bg-muted/20">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-red-500" /> The Trust Gap
                        </h3>
                        <p className="text-sm text-muted-foreground">Current "Verified" badges are just database flags. Platforms can silently label AI content as human to boost engagement.</p>
                    </div>
                </div>
            </section>

            {/* 3. The Solution */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold tracking-tight mb-4">3. The Solution: Cryptographic Provenance</h2>
                <p className="text-muted-foreground leading-7 mb-6">
                Humartz moves verification from a private database entry to a <strong>public cryptographic proof</strong>. We do not just flag content; we anchor its human status to a public root hash.
                </p>
                
                <div className="bg-zinc-950 text-zinc-50 rounded-xl p-6 font-mono text-sm overflow-x-auto my-8">
                    <div className="text-zinc-500 mb-2">// The "Humanity" Leaf Structure</div>
                    <div>Hash = Keccak256(ContentID + Metadata + "ORIGIN: HUMAN")</div>
                </div>

                <p className="text-muted-foreground leading-7">
                If anyone attempts to change the status of an AI track to "Human" without regenerating the entire public registry (which would be immediately detected), the cryptographic proof will fail on the client side.
                </p>
            </section>

            {/* 4. Architecture */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold tracking-tight mb-4">4. Technical Architecture</h2>
                <ul className="list-none space-y-4 pl-0">
                    <li className="flex gap-4 items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 text-xs font-bold text-primary">1</div>
                        <div>
                            <strong className="block text-foreground">The Registry (Hybrid)</strong>
                            <span className="text-muted-foreground">A curated database of content that has passed "Proof of Human" checks (biometric, session analysis, or community curation).</span>
                        </div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 text-xs font-bold text-primary">2</div>
                        <div>
                            <strong className="block text-foreground">The Anchor (Merkle Root)</strong>
                            <span className="text-muted-foreground">The state of the Registry is compressed into a single 32-byte Merkle Root published to the blockchain.</span>
                        </div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 text-xs font-bold text-primary">3</div>
                        <div>
                            <strong className="block text-foreground">The Verifier (Client-Side)</strong>
                            <span className="text-muted-foreground">A Javascript module runs in the user's browser, fetching proofs and verifying them against the Public Anchor.</span>
                        </div>
                    </li>
                </ul>
            </section>

            {/* 5. Roadmap */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold tracking-tight mb-4">5. Roadmap</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-primary/5 border-primary/20">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                        <div>
                            <div className="font-semibold text-sm uppercase tracking-wide text-primary">Phase 1: MVP (Current)</div>
                            <div className="text-sm text-muted-foreground">Centralized Curation + Merkle Proofs</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border rounded-lg opacity-60">
                         <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                        <div>
                            <div className="font-semibold text-sm uppercase tracking-wide">Phase 2: Decentralization</div>
                            <div className="text-sm text-muted-foreground">Publishing Roots to Solana for censorship resistance.</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border rounded-lg opacity-60">
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                        <div>
                            <div className="font-semibold text-sm uppercase tracking-wide">Phase 3: Community Validation</div>
                            <div className="text-sm text-muted-foreground">Staked curators vouching for human origin.</div>
                        </div>
                    </div>
                </div>
            </section>

             {/* Footer Note */}
             <div className="mt-20 p-8 bg-muted/30 rounded-2xl text-center">
                <h3 className="text-lg font-semibold mb-2">Join the Protocol</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                    Humartz is not anti-AI; it is pro-Human. We provide the infrastructure to value human intent.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/contact" className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition">
                        Contact Sales
                    </Link>
                </div>
             </div>

          </article>
        </div>
      </div>
    </>
  );
};

export default WhitePaperPage;