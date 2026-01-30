'use client';

import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@repo/design-system/components/ui/navigation-menu";
import type { Dictionary } from "@repo/internationalization";
import { Menu, MoveRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";

type HeaderProps = { dictionary: Dictionary };

export const Header = ({ dictionary }: HeaderProps) => {
  const navigationItems = [
    { title: dictionary.web.header.home, href: "/" },
    { title: dictionary.web.header.whitepaper, href: "/whitepaper", description: "Read the technical protocol." },
    {
      title: dictionary.web.header.product.title,
      description: dictionary.web.header.product.description,
      items: [{ title: dictionary.web.header.product.pricing, href: "/pricing" }],
    },
  ];

  const [isOpen, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:grid lg:grid-cols-3">
        {/* LEFT: Desktop Nav */}
        <div className="hidden lg:flex items-center gap-4">
          <NavigationMenu className="flex items-start justify-start">
            <NavigationMenuList className="flex flex-row justify-start gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <NavigationMenuLink asChild>
                      <Button asChild variant="ghost">
                        <Link href={item.href}>{item.title}</Link>
                      </Button>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-sm">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[400px] p-4">
                        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <Button asChild size="sm" className="mt-4">
                              <Link href="/upload">{dictionary.web.global.primaryCta}</Link>
                            </Button>
                          </div>
                          <div className="flex flex-col gap-1">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                className="flex items-center justify-between rounded px-4 py-2 hover:bg-muted"
                                href={subItem.href}
                                key={subItem.title}
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className="h-4 w-4 text-muted-foreground" />
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* CENTER: Logo */}
        <div className="flex items-center justify-center gap-2">
          <p className="font-semibold text-lg sm:text-xl">Humartz</p>
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <title>Humartz Fingerprint</title>
            <path
              d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* RIGHT: Utilities & Mobile Menu */}
        <div className="flex items-center justify-end gap-4">
          {/* Desktop utilities */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href="/contact">{dictionary.web.header.contact}</Link>
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex lg:hidden">
            <Button onClick={() => setOpen(!isOpen)} variant="ghost">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu content */}
      {isOpen && (
        <div className="lg:hidden border-t bg-background shadow-md">
          <div className="flex flex-col gap-3 py-4 px-4">
            {navigationItems.map((item) => (
              <div key={item.title} className="flex flex-col gap-2">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex justify-between w-full text-lg font-medium"
                  >
                    {item.title}
                    <MoveRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ) : (
                  <p className="text-lg font-medium">{item.title}</p>
                )}
                {item.items?.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.href}
                    className="flex justify-between w-full text-sm text-muted-foreground pl-4"
                  >
                    {subItem.title}
                    <MoveRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            ))}

            {/* Mobile utilities */}
            <div className="mt-4 flex flex-col gap-2">
              <LanguageSwitcher />
              <ModeToggle />
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">{dictionary.web.header.contact}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
