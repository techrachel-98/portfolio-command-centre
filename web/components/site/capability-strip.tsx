import { Layers, Workflow, ArrowLeftRight, Lightbulb, Cpu } from "lucide-react";

const ITEMS = [
  { icon: Layers, label: "Agentic systems" },
  { icon: Workflow, label: "Workflow automation" },
  { icon: ArrowLeftRight, label: "Full-stack delivery" },
  { icon: Lightbulb, label: "Applied LLM engineering" },
  { icon: Cpu, label: "AI-integrated software" },
];

export function CapabilityStrip() {
  return (
    <div className="border-t border-b border-border bg-secondary py-[26px]">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3.5">
        {ITEMS.map((item, i) => (
          <span key={item.label} className="contents">
            <span className="inline-flex items-center gap-2.5 font-heading font-medium text-sm text-text-soft">
              <item.icon size={15} className="text-purple" />
              {item.label}
            </span>
            {i < ITEMS.length - 1 && (
              <span className="hidden sm:block w-1 h-1 rounded-full bg-input" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
