import { Briefcase, GraduationCap, Layers, Mail } from "lucide-react";
import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getEducation, getProjects } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const [projects, education] = await Promise.all([getProjects(), getEducation()]);
  const apify = Boolean(process.env.APIFY_TOKEN);

  const cards = [
    { label: "Projects", value: projects ? String(projects.length) : "—", note: projects ? "From Supabase" : "Supabase unreachable", icon: Layers },
    { label: "Education", value: education ? String(education.length) : "—", note: education ? "From Supabase" : "Supabase unreachable", icon: GraduationCap },
    { label: "Job search", value: apify ? "Live" : "Sample", note: apify ? "Apify connected" : "No APIFY_TOKEN set", icon: Briefcase },
    { label: "Contact form", value: "FormSubmit", note: "n8n planned", icon: Mail },
  ];

  const sources = [
    { name: "Projects & Education", where: "Supabase", status: projects && education ? "OK" : "Using fallback" },
    { name: "Job Match", where: "Apify (LinkedIn)", status: apify ? "OK" : "Sample data" },
    { name: "Contact form", where: "FormSubmit → Gmail", status: "OK" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {cards.map(({ label, value, note, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between">
            <div>
              <p className="text-text-soft text-[0.85rem]">{label}</p>
              <p className="font-heading font-bold text-[1.7rem] mt-1">{value}</p>
              <p className="text-text-faint text-[0.8rem] mt-1">{note}</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-purple-wash border border-purple-line grid place-items-center text-purple">
              <Icon size={18} />
            </span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <h2 className="font-heading font-semibold text-[1rem] px-5 py-4 border-b border-border">Data sources</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.9rem]">
            <thead className="text-left text-text-faint text-[0.78rem] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 font-medium">Feature</th>
                <th className="px-5 py-3 font-medium">Source</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.name} className="border-t border-border">
                  <td className="px-5 py-3.5">{s.name}</td>
                  <td className="px-5 py-3.5 text-text-soft">{s.where}</td>
                  <td className="px-5 py-3.5">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
