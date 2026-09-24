import { ArrowUp } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-11 border-t border-border bg-secondary">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-7 flex flex-wrap items-center justify-between gap-3.5 text-[13.5px] text-text-faint">
        <span className="inline-flex items-center gap-2.25 font-heading font-semibold text-text-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-purple" />
          Rachel Sigamani
        </span>
        <span>
          &copy; {year} · Built with Next.js, TypeScript &amp; Tailwind
        </span>
        <span className="flex items-center gap-5.5">
          <a href="https://www.linkedin.com/in/rachelavrill/" target="_blank" rel="noopener" className="text-text-soft font-medium">
            LinkedIn
          </a>
          <a href="https://github.com/techrachel-98" target="_blank" rel="noopener" className="text-text-soft font-medium">
            GitHub
          </a>
          <a href="mailto:techwithrachel@gmail.com" className="text-text-soft font-medium">
            Email
          </a>
          <a href="#top" className="inline-flex items-center gap-1.5 text-purple font-heading font-semibold text-[13px] hover:no-underline">
            Back to top
            <ArrowUp size={13} className="transition-transform hover:-translate-y-0.5" />
          </a>
        </span>
      </div>
    </footer>
  );
}
