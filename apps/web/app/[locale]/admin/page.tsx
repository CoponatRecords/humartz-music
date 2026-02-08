// app/arbitrum/page.tsx
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { ArbitrumForm } from "../components/arbitrum-form";
import { getDictionary } from "@repo/internationalization";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type ArbitrumPageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({ params }: ArbitrumPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.arbitrum.meta);
};

const ArbitrumPage = async ({ params }: ArbitrumPageProps) => {
  const { locale } = await params;
  
  // 1. Check Authentication
  const { userId } = await auth();
  if (!userId) {
    redirect(`/${locale}/`);
  }

  // 2. Check Authorization (Admin Role)
  const user = await currentUser();
  const role = user?.publicMetadata?.role;

  if (role !== "admin") {
    // Redirect unauthorized users to home
    redirect(`/${locale}`);
  }

  const dictionary = await getDictionary(locale);
  return <ArbitrumForm dictionary={dictionary} />;
};

export default ArbitrumPage;