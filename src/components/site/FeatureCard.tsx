import type { LucideIcon } from "lucide-react";

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition group-hover:bg-slate-800">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}
