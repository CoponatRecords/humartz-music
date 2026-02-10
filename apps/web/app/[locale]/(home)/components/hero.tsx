// components/hero/Hero.tsx
import { GridPattern } from "../../components/magic-ui/grid-pattern"; // adjust path
import { cn } from "@repo/design-system";
import HeroContent from "./HeroContent";
import GetStartedSection from "./GetStartedSection";
import type { Dictionary } from "@repo/internationalization";

export default function Hero({ dictionary }: { dictionary: Dictionary }) {
  const { web } = dictionary;

  return (
    <div className="w-full relative overflow-hidden text-white">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "absolute inset-0 mask-[radial-gradient(ellipse_at_center,white,transparent_50%)] z-0 opacity-20 pointer-events-none"
        )}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <HeroContent dictionary={dictionary} />

        <GetStartedSection dictionary={dictionary} />
      </div>
    </div>
  );
}