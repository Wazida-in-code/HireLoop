import Image from "next/image";
import Link from "next/link";
import { Share2, BriefcaseBusiness, Pin } from "lucide-react";

import logo from "@/app/images/logo.png";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Worker AI", href: "/worker-ai" },
      { label: "Companies", href: "/companies" },
      { label: "Salary data", href: "/salary-data" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Career library", href: "/career-library" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "/brand-guideline" },
      { label: "Newsroom", href: "/newsroom" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="striped-dark border-t border-white/10 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image src={logo} alt="HireLoop" className="h-10 w-auto" />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-white/50">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>

            {/* Social Icons */}
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-md bg-white/10 text-white/70 transition hover:bg-[#5b50e6] hover:text-white"
              >
                <Share2 size={17} />
              </Link>

              <Link
                href="https://pinterest.com"
                target="_blank"
                aria-label="Pinterest"
                className="flex size-9 items-center justify-center rounded-md bg-white/10 text-white/70 transition hover:bg-[#5b50e6] hover:text-white"
              >
                <Pin size={17} />
              </Link>

              <Link
                href="https://linkedin.com"
                target="_blank"
                aria-label="LinkedIn"
                className="flex size-9 items-center justify-center rounded-md bg-white/10 text-white/70 transition hover:bg-[#5b50e6] hover:text-white"
              >
                <BriefcaseBusiness size={17} />
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-5 text-sm font-medium text-[#a5a0f5]">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © {new Date().getFullYear()} — Wazida-Esha</p>

          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="hover:text-white transition">
              Terms &amp; Policy
            </Link>

            <Link href="/privacy" className="hover:text-white transition">
              Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
