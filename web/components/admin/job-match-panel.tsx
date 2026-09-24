"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, RefreshCw, Search } from "lucide-react";
import { sortJobs, type Job, type MatchLevel, type SortKey } from "@/lib/job-match";

const BADGES: Record<MatchLevel, { label: string; className: string }> = {
  strong: { label: "Strong Match", className: "text-emerald-300 bg-emerald-500/10 border-emerald-500/40" },
  good: { label: "Good Match", className: "text-yellow-300 bg-yellow-500/10 border-yellow-500/40" },
  explore: { label: "Explore", className: "text-red-300 bg-red-500/10 border-red-500/40" },
};

const inputClass =
  "w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[0.93rem] text-foreground placeholder:text-text-faint focus:outline-none focus:border-purple-line";

function timeAgo(iso: string | null): string {
  const t = iso ? Date.parse(iso) : NaN;
  if (Number.isNaN(t)) return iso ?? "—";
  const days = Math.floor((Date.now() - t) / 86_400_000);
  if (days <= 0) return "Today";
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export function JobMatchPanel() {
  const [q, setQ] = useState("AI automation");
  const [location, setLocation] = useState("Malaysia");
  const [sort, setSort] = useState<SortKey>("match");
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // job_id → true for every job marked as applied (persisted in Supabase).
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [trackingError, setTrackingError] = useState("");

  useEffect(() => {
    fetch("/api/admin/applications")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Couldn't load applications.");
        setApplied(Object.fromEntries((data.applications as { job_id: string }[]).map((a) => [a.job_id, true])));
      })
      .catch((err) => setTrackingError(err instanceof Error ? err.message : "Couldn't load applications."));
  }, []);

  async function toggleApplied(job: Job) {
    const next = !applied[job.id];
    setApplied((prev) => ({ ...prev, [job.id]: next })); // optimistic
    try {
      const res = next
        ? await fetch("/api/admin/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ job_id: job.id, title: job.title, company: job.company, location: job.location, url: job.url }),
          })
        : await fetch(`/api/admin/applications?${new URLSearchParams({ job_id: job.id })}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Couldn't save.");
      setTrackingError("");
    } catch (err) {
      setApplied((prev) => ({ ...prev, [job.id]: !next })); // roll back
      setTrackingError(err instanceof Error ? err.message : "Couldn't save.");
    }
  }

  const sorted = useMemo(() => (jobs ? sortJobs(jobs, sort) : []), [jobs, sort]);
  const count = (level: MatchLevel) => jobs?.filter((j) => j.match.level === level).length ?? 0;
  const appliedTotal = Object.values(applied).filter(Boolean).length;

  function search(e: React.FormEvent) {
    e.preventDefault();
    return run(false);
  }

  async function run(refresh: boolean) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ q, location });
      if (refresh) params.set("refresh", "1");
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed.");
      setJobs(data.jobs);
      setDemo(Boolean(data.demo));
    } catch (err) {
      setJobs(null);
      setError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    { label: "Total jobs", value: jobs?.length ?? 0, className: "text-foreground" },
    { label: "Strong Match", value: count("strong"), className: "text-emerald-300" },
    { label: "Good Match", value: count("good"), className: "text-yellow-300" },
    { label: "Explore", value: count("explore"), className: "text-red-300" },
    { label: "Applied (all time)", value: appliedTotal, className: "text-purple" },
  ];

  return (
    <div className="grid gap-6">
      {trackingError && (
        <p role="alert" className="text-yellow-300 text-[0.88rem] bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
          Application tracking: {trackingError}
        </p>
      )}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            <p className="text-text-soft text-[0.85rem]">{s.label}</p>
            <p className={`font-heading font-bold text-[1.7rem] mt-1 ${s.className}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl">
        <form onSubmit={search} className="p-5 grid sm:grid-cols-[1fr_1fr_auto] gap-3 border-b border-border">
          <input className={inputClass} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title or keywords" aria-label="Job title or keywords" required maxLength={100} />
          <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" aria-label="Location" maxLength={100} />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple px-6 py-2.5 font-heading font-semibold text-[0.93rem] text-white disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {error && <p role="alert" className="text-red-300 text-[0.9rem] px-5 pt-4">{error}</p>}
        {loading && <p className="text-text-soft text-[0.88rem] px-5 pt-4">Fetching from LinkedIn — this can take up to a minute.</p>}

        {jobs && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4">
              <p className="text-text-soft text-[0.88rem]">
                {sorted.length} job{sorted.length === 1 ? "" : "s"}
                {demo && " · sample data (no Apify token configured)"}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => run(true)}
                  disabled={loading}
                  title="Skip the 10-minute cache and scrape LinkedIn again (uses Apify credits)"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-[0.88rem] text-foreground hover:border-purple-line disabled:opacity-60"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
                <label className="flex items-center gap-2 text-[0.88rem] text-text-soft">
                  Sort by
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-foreground"
                  >
                    <option value="match">Match Score</option>
                    <option value="date">Date Posted</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[0.9rem]">
                <thead className="text-left text-text-faint text-[0.78rem] uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-medium">Job</th>
                    <th className="px-5 py-3 font-medium">Location</th>
                    <th className="px-5 py-3 font-medium">Posted</th>
                    <th className="px-5 py-3 font-medium">Match</th>
                    <th className="px-5 py-3 font-medium">Matched skills</th>
                    <th className="px-5 py-3 font-medium">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((job) => {
                    const badge = BADGES[job.match.level];
                    return (
                      <tr key={job.id} className="border-t border-border align-top">
                        <td className="px-5 py-3.5 min-w-[220px]">
                          <p className="font-semibold">{job.title}</p>
                          <p className="text-text-soft text-[0.85rem] flex items-center gap-2">
                            {job.company}
                            {job.url && (
                              <a href={job.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${job.title} on LinkedIn`} className="text-purple">
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 text-text-soft">{job.location || "—"}</td>
                        <td className="px-5 py-3.5 text-text-soft whitespace-nowrap">{timeAgo(job.postedAt)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-block whitespace-nowrap font-heading text-[11.5px] font-semibold px-3 py-1 rounded-full border ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1.5">
                            {job.match.skills.length === 0 && <span className="text-text-faint">—</span>}
                            {job.match.skills.map((s) => (
                              <span key={s} className="font-heading text-[11px] font-medium text-purple bg-purple-wash border border-purple-line px-2 py-0.5 rounded-full">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <input
                            type="checkbox"
                            checked={Boolean(applied[job.id])}
                            onChange={() => toggleApplied(job)}
                            disabled={demo}
                            title={demo ? "Sample jobs can't be tracked" : "Tick once you've applied on LinkedIn"}
                            aria-label={`Applied to ${job.title} at ${job.company}`}
                            className="h-4.5 w-4.5 accent-[var(--purple)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {sorted.length === 0 && <p className="text-text-soft px-5 pb-5">No jobs found. Try different keywords.</p>}
          </>
        )}
        {!jobs && !loading && !error && <p className="text-text-soft text-[0.9rem] px-5 py-6">Run a search to see scored results.</p>}
      </div>
    </div>
  );
}
