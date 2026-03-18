"use client";

import { LineChart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const menuItems = [
    { href: "/ga4", label: "Générateur GA4" },
    { href: "/variables", label: "Générateur variables" },
    { href: "/events", label: "Générateur events" },
    { href: "/tracking-plan", label: "Tracking Plan" },
  ];

  const pathname = usePathname();

  const isActive = (href) => pathname.startsWith(href);

  return (
    <div className="hidden border-r border-sidebar-border bg-sidebar md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-18 items-center border-b border-sidebar-border px-4 lg:h-[75px] lg:px-6 py-4">
          <Link href="/events" className="flex items-center gap-2 font-semibold">
            <Image
              src="/images/logo-boryl.svg"
              alt="Company Logo"
              width={300}
              height={100}
              className="h-8 w-auto mx-auto"
            />
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 py-2 text-sm font-medium lg:px-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent"
                }`}
              >
                <LineChart className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
