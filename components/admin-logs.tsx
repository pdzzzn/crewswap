"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

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
  return <Badge variant="outline" className={`text-xs font-medium ${color}`}>{level}</Badge>;
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
      <div className="flex items-center flex-wrap gap-2 mb-4">
          <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <SelectTrigger className="w-[140px]" title="Time range">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24h</SelectItem>
              <SelectItem value="3">Last 3 days</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={level || "all"} onValueChange={(v) => setLevel(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[140px]" title="Level">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="error">error</SelectItem>
              <SelectItem value="warn">warn</SelectItem>
              <SelectItem value="info">info</SelectItem>
              <SelectItem value="debug">debug</SelectItem>
            </SelectContent>
          </Select>
          <Input className="w-36" placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} />
          <Input className="w-44" placeholder="Route" value={route} onChange={(e) => setRoute(e.target.value)} />
          <Input className="w-56" placeholder="Search message/meta" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button onClick={fetchLogs} disabled={loading} size="sm">{loading ? "Loading..." : "Apply"}</Button>
          <div className="flex items-center gap-2 pl-2" title="Live tail inserts">
            <Label htmlFor="live-tail" className="text-sm">Live</Label>
            <Switch id="live-tail" checked={liveTail} onCheckedChange={setLiveTail} disabled={loading} />
          </div>
      </div>

      <div className="mb-3 flex items-center">
        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        <div className="flex items-center gap-1 ml-auto">
          <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={loading || page === 1} title="Previous page">Prev</Button>
          <span className="text-sm text-muted-foreground px-1">Page {page}</span>
          <Button variant="secondary" size="sm" onClick={() => setPage((p) => p + 1)} disabled={loading || !hasMore} title="Next page">Next</Button>
        </div>
      </div>

      <div className="overflow-auto border rounded">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-left p-2 whitespace-nowrap">Time</TableHead>
              <TableHead className="text-left p-2">Level</TableHead>
              <TableHead className="text-left p-2">Area</TableHead>
              <TableHead className="text-left p-2">Route</TableHead>
              <TableHead className="text-left p-2">Message</TableHead>
              <TableHead className="text-left p-2">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} className="p-4 text-center text-muted-foreground">No logs found</TableCell>
              </TableRow>
            )}
            {logs.map((r) => (
              <Row key={r.id} row={r} />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function Row({ row }: { row: AppLogRow }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow className="border-b align-top">
        <TableCell className="p-2 whitespace-nowrap text-muted-foreground">{fmtDate(row.created_at)}</TableCell>
        <TableCell className="p-2"><LevelBadge level={row.level} /></TableCell>
        <TableCell className="p-2">{row.area || "-"}</TableCell>
        <TableCell className="p-2">{row.route || "-"}</TableCell>
        <TableCell className="p-2 break-words max-w-[40ch]">{row.message}</TableCell>
        <TableCell className="p-2">
          {(row.meta || row.request_id || row.correlation_id) ? (
            <Button variant="link" size="sm" className="px-0" onClick={() => setOpen(!open)}>
              {open ? "Hide" : "View"}
            </Button>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
      </TableRow>
      {open && (
        <TableRow className="border-b">
          <TableCell colSpan={6} className="p-2 bg-muted/30">
            <pre className="text-xs whitespace-pre-wrap break-words">
{JSON.stringify({ request_id: row.request_id, correlation_id: row.correlation_id, meta: row.meta }, null, 2)}
            </pre>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
