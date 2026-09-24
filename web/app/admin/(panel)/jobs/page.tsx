import { AdminShell } from "@/components/admin/shell";
import { JobMatchPanel } from "@/components/admin/job-match-panel";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminJobs() {
  await requireAdmin();
  return (
    <AdminShell title="Job Match">
      <JobMatchPanel />
    </AdminShell>
  );
}
