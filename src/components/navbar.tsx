"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/app/images/logo.png";
import { authClient, useSession } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";

const links = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const {data, error} = useSession() 
  const user = data?.user 

  const handleSignOut = async() => {
   await authClient.signOut();
    window.location.href = "/";
  }
  return (
    <header
      className="striped-dark sticky top-0 z-50 border-b border-white/5"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="HireLoop home" onClick={closeMenu}>
          <Image
            src={logo}
            alt="HireLoop"
            priority
            className="h-8 w-auto sm:h-9 md:h-10"
          />
        </Link>

        {/* Desktop navigation */}
        {/* Desktop navigation */}
<div className="hidden items-center gap-4 md:flex">
  {user ? (
    <>
      <p className="text-lg font-bold tracking-tight text-white">
        {user.name}
      </p>

      <button
        onClick={handleSignOut}
        className="h-9 rounded-md bg-[#5b50e6] px-3 text-sm text-white hover:bg-[#4a3fd6]"
      >
        Sign-Out
      </button>
    </>
  ) : (
    <nav aria-label="Main" className="flex items-center gap-6 lg:gap-8">
      {links.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className="text-sm font-medium text-white/90 hover:text-white"
        >
          {label}
        </Link>
      ))}

      <span className="h-5 w-px bg-white/25" />

      <Link
        href="/sign-in"
        className="text-sm font-medium text-[#a5a0f5]"
      >
        Sign In
      </Link>

      <Button
        render={<Link href="/sign-up" />}
        nativeButton={false}
        className="h-9 bg-[#5b50e6] px-4 text-white hover:bg-[#4a3fd6]"
      >
        Get Started
      </Button>
    </nav>
  )}
</div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-white/10 md:hidden"
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-white/10 px-4 pb-4 pt-2 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
          {user ? 
          <div className="mt-3 flex flex-col items-center gap-3 border-t border-white/10 pt-3">
    <p className="max-w-full break-words text-center text-base font-bold text-white">
      {user.name}
    </p>

    <button
      onClick={handleSignOut}
      className="h-9 w-full rounded-md bg-[#5b50e6] px-3 text-sm text-white hover:bg-[#4a3fd6]"
    >
      Sign-Out
    </button>
  </div>
            :
          <div className="mt-2 flex items-center gap-4 border-t border-white/10 pt-3">
            <Link
              href="/sign-in"
              onClick={closeMenu}
              className="text-sm font-medium text-[#a5a0f5] transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Button
              render={<Link href="/sign-up" onClick={closeMenu} />}
              nativeButton={false}
              className="h-9 flex-1 bg-[#5b50e6] px-4 text-white hover:bg-[#4a3fd6]"
            >
              Get Started
            </Button>
          </div>
          }
        </nav>
      )}
    </header>
  );
}
