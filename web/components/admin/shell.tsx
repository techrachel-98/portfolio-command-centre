"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, ExternalLink, LayoutDashboard, LogOut, Menu, X } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Job Match", icon: Briefcase },
];

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-secondary border-r border-border flex flex-col transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          <span className="font-heading font-bold text-[1.05rem]">
            Rachel<span className="text-purple">.</span> Admin
          </span>
          <button className="lg:hidden text-text-soft" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 p-3 grid content-start gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.93rem] font-medium hover:no-underline transition-colors ${
                  active ? "bg-purple-wash text-purple border border-purple-line" : "text-text-soft hover:text-foreground border border-transparent"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9rem] text-text-soft hover:text-foreground hover:no-underline">
            <ExternalLink size={16} /> View site
          </Link>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Header */}
      <header className="sticky top-0 z-20 h-16 px-5 sm:px-7 flex items-center justify-between bg-background/85 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3">
          <button className="lg:hidden text-text-soft" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <h1 className="font-heading font-semibold text-[1.05rem]">{title}</h1>
        </div>
        <button onClick={logout} className="inline-flex items-center gap-2 text-[0.9rem] text-text-soft hover:text-foreground">
          <LogOut size={16} /> Sign out
        </button>
      </header>

      <main className="p-5 sm:p-7 max-w-[1200px]">{children}</main>
    </div>
  );
}
