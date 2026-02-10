"use client";

import { useId } from "react";
import wallpaper from "./wallpaper.webp"; 

export function BackgroundImage({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "10 5",
  squares,
  className,
  ...props
}: any) {
  const id = useId();

  return (
    <div 
      className="absolute inset-0 -z-20 h-full w-full overflow-hidden"
      /* This mask creates the diminishing transparency effect from top to bottom */
      style={{
        maskImage: 'linear-gradient(to bottom, white 20%, transparent 90%)',
        WebkitMaskImage: 'linear-gradient(to bottom, white 20%, transparent 90%)'
      }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale"
        style={{ 
          backgroundImage: `url('${wallpaper.src}')`,
          zIndex: -1000 
        }}
      />
      
      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" style={{ zIndex: -25 }} />    

      {/* Optional: Extra bottom "smoother" to blend into your site background color */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" style={{ zIndex: -10 }} />
    </div>
  );
}