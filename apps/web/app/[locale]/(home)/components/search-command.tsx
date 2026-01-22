"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Search, X, Music, FileText, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@repo/design-system/lib/utils"; // Adjust this path to your utils

// --- 1. CONTEXT SETUP ---
type SearchContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};

// --- 2. THE PROVIDER (Wraps App + Renders Modal) ---
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  // Handle CMD+K / CTRL+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}

      {/* GLOBAL MODAL DIALOG */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[15vh]">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all duration-100"
            onClick={() => setOpen(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative z-50 w-full max-w-lg gap-4 rounded-xl border bg-background shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
            
            {/* Search Input Area */}
            <div className="flex items-center border-b px-3 py-1">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                placeholder="Search documentation, verify tracks..."
                className="flex h-12 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <button 
                onClick={() => setOpen(false)}
                className="ml-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Results / Links Area */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Platform
              </div>
              
              <CommandLink href="/" setOpen={setOpen} icon={<Music className="h-4 w-4" />}>
                Home
              </CommandLink>
              <CommandLink href="/docs" setOpen={setOpen} icon={<FileText className="h-4 w-4" />}>
                Documentation
              </CommandLink>
              <CommandLink href="/verify" setOpen={setOpen} icon={<CheckCircle className="h-4 w-4" />}>
                Verify a Track
              </CommandLink>

              <div className="mt-4 mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Support
              </div>
              <CommandLink href="/contact" setOpen={setOpen} icon={<ArrowRight className="h-4 w-4" />}>
                Contact Sales
              </CommandLink>
            </div>
            
            {/* Footer Tip */}
            <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
              <span>Search powered by Humartz</span>
              <div className="flex gap-2">
                <span>Select &uarr;&darr;</span>
                <span>Open &crarr;</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </SearchContext.Provider>
  );
};

// --- 3. THE TRIGGER BUTTON (Place anywhere) ---
// --- 3. THE TRIGGER BUTTON (Updated for single line & thin look) ---
interface SearchTriggerProps {
  className?: string;
  placeholder?: string;
}

export const SearchTrigger = ({ className, placeholder = "Search..." }: SearchTriggerProps) => {
  const { setOpen } = useSearch();

  return (
    <button
      onClick={() => setOpen(true)}
      className={cn(
        // Added: 'h-9' (fixed thin height), 'whitespace-nowrap' (no wrapping)
        "group relative flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground w-full md:w-[280px] whitespace-nowrap",
        className
      )}
    >
      <Search className="h-4 w-4 opacity-50 shrink-0" />
      <span className="flex-1 text-left truncate">{placeholder}</span>
      <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 text-muted-foreground shrink-0">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
};

// --- Helper Component for Links ---
const CommandLink = ({ href, setOpen, icon, children }: any) => (
  <Link
    href={href}
    onClick={() => setOpen(false)}
    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground group transition-colors"
  >
    <span className="mr-2 text-muted-foreground group-hover:text-primary transition-colors">
      {icon}
    </span>
    <span>{children}</span>
  </Link>
);