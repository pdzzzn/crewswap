"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface AppLogRow {
  id: string;
  created_at: string;
  level: "debug" | "info" | "warn" | "error" | string;
  area: string | null;
  route: string | null;
  message: string;
  meta: Record<string, any> | null;
  request_id: string | null;
  correlation_id: string | null;
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function LevelBadge({ level }: { level: string }) {
  const color =
    level === "error" ? "bg-red-100 text-red-700"
    : level === "warn" ? "bg-yellow-100 text-yellow-700"
    : level === "info" ? "bg-blue-100 text-blue-700"
    : level === "debug" ? "bg-gray-100 text-gray-700"
    : "bg-slate-100 text-slate-700";
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>{level}</span>;
}

export default function AdminLogs() {
  const supabase = useMemo(() => createClient(), []);
  const [logs, setLogs] = useState<AppLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveTail, setLiveTail] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Filters
  const [days, setDays] = useState(7);
  const [level, setLevel] = useState<string>(""); // all
  const [area, setArea] = useState("");
  const [route, setRoute] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [hasMore, setHasMore] = useState(false);

  async function fetchLogs() {
    setLoading(true);
    setError(null);
    try {
      const fromIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      let q = supabase
        .from("app_logs")
        .select("id,created_at,level,area,route,message,meta,request_id,correlation_id")
        .gte("created_at", fromIso)
        .order("created_at", { ascending: false })
      
      // Server-side filters
      if (level) q = q.eq("level", level);
      if (area.trim()) q = q.ilike("area", `%${area.trim()}%`);
      if (route.trim()) q = q.ilike("route", `%${route.trim()}%`);

      // Pagination via range
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      q = q.range(from, to);

      const { data, error } = await q;
      if (error) throw new Error(error.message);

      // Client-side message search (keeps server-side simple)
      const filtered = (data || []).filter((r) =>
        search.trim()
          ? (r.message?.toLowerCase().includes(search.trim().toLowerCase()) ||
             JSON.stringify(r.meta || {}).toLowerCase().includes(search.trim().toLowerCase()))
          : true
      );

      setLogs(filtered as AppLogRow[]);
      setHasMore((data?.length || 0) === pageSize);
    } catch (e: any) {
      setError(e?.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Reset to page 1 when filters change and fetch
  useEffect(() => {
    setPage(1);
    // fetch will run via page effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, level, area, route, search]);

  // Live tail subscription
  useEffect(() => {
    if (!liveTail) {
      // cleanup
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const ch = supabase.channel("app_logs_tailer");
    channelRef.current = ch;
    ch.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "app_logs" },
      (payload) => {
        const r = payload.new as any as AppLogRow;
        // Apply current filters
        const fromIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        const matchTime = r.created_at >= fromIso;
        const matchLevel = !level || r.level === level;
        const matchArea = !area.trim() || (r.area || "").toLowerCase().includes(area.trim().toLowerCase());
        const matchRoute = !route.trim() || (r.route || "").toLowerCase().includes(route.trim().toLowerCase());
        const matchSearch = !search.trim() ||
          r.message.toLowerCase().includes(search.trim().toLowerCase()) ||
          JSON.stringify(r.meta || {}).toLowerCase().includes(search.trim().toLowerCase());
        if (matchTime && matchLevel && matchArea && matchRoute && matchSearch) {
          // Only prepend on first page to avoid confusing pagination
          setLogs((prev) => (page === 1 ? [r, ...prev].slice(0, pageSize) : prev));
        }
      }
    ).subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveTail, days, level, area, route, search, page]);

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Application Logs</h2>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 bg-background"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            title="Time range"
          >
            <option value={1}>Last 24h</option>
            <option value={3}>Last 3 days</option>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <select
            className="border rounded px-2 py-1 bg-background"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            title="Level"
          >
            <option value="">All levels</option>
            <option value="error">error</option>
            <option value="warn">warn</option>
            <option value="info">info</option>
            <option value="debug">debug</option>
          </select>
          <input
            className="border rounded px-2 py-1 w-36 bg-background"
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1 w-44 bg-background"
            placeholder="Route"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1 w-56 bg-background"
            placeholder="Search message/meta"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="border rounded px-3 py-1 bg-primary text-primary-foreground disabled:opacity-50"
            onClick={fetchLogs}
            disabled={loading}
          >
            {loading ? "Loading..." : "Apply"}
          </button>
          <button
            className={`border rounded px-3 py-1 ${liveTail ? 'bg-green-600 text-white' : 'bg-background'} disabled:opacity-50`}
            onClick={() => setLiveTail((v) => !v)}
            disabled={loading}
            title="Live tail inserts"
          >
            {liveTail ? "Live: ON" : "Live: OFF"}
          </button>
          <div className="flex items-center gap-1 ml-2">
            <button
              className="border rounded px-2 py-1 bg-background disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={loading || page === 1}
              title="Previous page"
            >
              Prev
            </button>
            <span className="text-sm text-muted-foreground px-1">Page {page}</span>
            <button
              className="border rounded px-2 py-1 bg-background disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={loading || !hasMore}
              title="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-3 text-sm text-red-600">{error}</div>
      )}

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2 whitespace-nowrap">Time</th>
              <th className="text-left p-2">Level</th>
              <th className="text-left p-2">Area</th>
              <th className="text-left p-2">Route</th>
              <th className="text-left p-2">Message</th>
              <th className="text-left p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">No logs found</td>
              </tr>
            )}
            {logs.map((r) => (
              <Row key={r.id} row={r} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Row({ row }: { row: AppLogRow }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr className="border-b align-top">
        <td className="p-2 whitespace-nowrap text-muted-foreground">{fmtDate(row.created_at)}</td>
        <td className="p-2"><LevelBadge level={row.level} /></td>
        <td className="p-2">{row.area || "-"}</td>
        <td className="p-2">{row.route || "-"}</td>
        <td className="p-2 break-words max-w-[40ch]">{row.message}</td>
        <td className="p-2">
          {(row.meta || row.request_id || row.correlation_id) ? (
            <button className="underline text-primary" onClick={() => setOpen(!open)}>
              {open ? "Hide" : "View"}
            </button>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </td>
      </tr>
      {open && (
        <tr className="border-b">
          <td colSpan={6} className="p-2 bg-muted/30">
            <pre className="text-xs whitespace-pre-wrap break-words">
{JSON.stringify({ request_id: row.request_id, correlation_id: row.correlation_id, meta: row.meta }, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}
