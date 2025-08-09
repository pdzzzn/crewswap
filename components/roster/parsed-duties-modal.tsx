'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter, List } from 'lucide-react';
import type { Duty, DutyType, StagedDutyBlock } from '@/lib/types';

interface ParsedDutiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: StagedDutyBlock[];
  duties: Duty[];
  onImported?: () => void;
}

export function ParsedDutiesModal({ isOpen, onClose, blocks: initialBlocks, duties, onImported }: ParsedDutiesModalProps) {
  const [blocks, setBlocks] = useState<StagedDutyBlock[]>(initialBlocks);
  const [selectedLegIds, setSelectedLegIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Record<DutyType, boolean>>({ OFF: true, DEADHEAD: true, FLIGHT: true, STANDBY: true });
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'select' | 'overview'>('select');

  // Subtle coloring per duty type for better visual separation
  const typeStyles: Record<DutyType, string> = {
    OFF: 'border-yellow-300/70 bg-yellow-50 dark:bg-yellow-900/20',
    DEADHEAD: 'border-sky-300/70 bg-sky-50 dark:bg-sky-900/20',
    FLIGHT: 'border-emerald-300/70 bg-emerald-50 dark:bg-emerald-900/20',
    STANDBY: 'border-purple-300/70 bg-purple-50 dark:bg-purple-900/20',
  };

  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  // Preselect all legs when blocks change
  useEffect(() => {
    const allIds = blocks.flatMap(b => b.legs.map(l => l.id));
    setSelectedLegIds(new Set(allIds));
  }, [blocks]);

  const visibleLegIds = useMemo(() => new Set(blocks.flatMap(b => b.legs.filter(l => filters[l.type]).map(l => l.id))), [blocks, filters]);

  const toggleFilter = (t: DutyType) => setFilters(prev => ({ ...prev, [t]: !prev[t] }));
  const handleToggleLeg = (legId: string) => {
    setSelectedLegIds(prev => {
      const next = new Set(prev);
      if (next.has(legId)) next.delete(legId); else next.add(legId);
      return next;
    });
  };
  const handleSelectAllVisible = () => setSelectedLegIds(new Set(visibleLegIds));
  const handleSelectNone = () => setSelectedLegIds(new Set());

  const handleLegNotesChange = (blockId: string, legId: string, notes: string) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, legs: b.legs.map(l => l.id === legId ? { ...l, notes } : l) } : b));
  };

  const handleSaveAll = async () => {
    const payloadBlocks = blocks
      .map(b => ({ ...b, legs: b.legs.filter(l => selectedLegIds.has(l.id) && filters[l.type]) }))
      .filter(b => b.legs.length > 0);

    setIsImporting(true);
    setError(null);
    try {
      const res = await fetch('/api/duties/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: payloadBlocks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');
      onImported?.();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to import duties');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] md:max-w-[75vw] w-full h-[80vh] flex flex-col bg-background">
        <DialogHeader className="px-4 md:px-6">
          <DialogTitle>Parsed Duties</DialogTitle>
          <DialogDescription>
            Review all parsed duties, optionally add notes, and choose which to import.
          </DialogDescription>
        </DialogHeader>

        {/* Uniform padded wrapper for tabs + content */}
        <div className="flex-1 min-h-0 flex flex-col px-4 md:px-6">
          {/* Tabs */}
          <div className="mb-3 flex items-center gap-2">
            <Button variant={activeTab === 'select' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('select')}>
              Select
            </Button>
            <Button variant={activeTab === 'overview' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('overview')}>
              Overview
            </Button>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
            {activeTab === 'select' ? (
              <div className="border rounded-md p-4 bg-muted/50">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Filter className="w-5 h-5 mr-2" /> Select duties to upload
                </h3>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap gap-2">
                    {(['OFF','DEADHEAD','FLIGHT','STANDBY'] as DutyType[]).map(t => (
                      <Button key={t} variant={filters[t] ? 'default' : 'outline'} size="sm" onClick={() => toggleFilter(t)}>
                        {t}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <Button variant="outline" size="sm" onClick={handleSelectAllVisible}>Select visible</Button>
                    <Button variant="outline" size="sm" onClick={handleSelectNone}>Select none</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {blocks.map(block => (
                    <div key={block.id} className="bg-background border rounded-md p-3">
                      <div className="text-sm text-muted-foreground mb-2">{block.startDate} → {block.endDate} • {block.type}</div>
                      <div className="space-y-2">
                        {block.legs.filter(l => filters[l.type]).map(leg => (
                          <div
                            key={leg.id}
                            className={`grid items-center gap-3 grid-cols-[auto_6rem_1fr_6rem_14rem] min-h-[32px] rounded-sm pl-3 border-l-4 ${typeStyles[leg.type]}`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedLegIds.has(leg.id)}
                              onChange={() => handleToggleLeg(leg.id)}
                              className="justify-self-start"
                            />
                            <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-muted text-center w-[6rem] whitespace-nowrap truncate">
                              {leg.code}
                            </span>
                            <span className="text-sm whitespace-nowrap truncate">
                              {leg.dep} {leg.depTime ?? ''} → {leg.arr} {leg.arrTime ?? ''}
                            </span>
                            <span className="text-xs text-muted-foreground w-[6rem] text-center whitespace-nowrap">
                              {leg.type}
                            </span>
                            <input
                              className="border rounded px-2 py-1 text-sm w-[14rem] justify-self-end"
                              placeholder="Notes"
                              value={leg.notes ?? ''}
                              onChange={(e) => handleLegNotesChange(block.id, leg.id, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border rounded-md p-4 bg-muted/50">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <List className="w-5 h-5 mr-2" /> Grouped Overview (by C/I → C/O blocks)
                </h3>
                {blocks.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No duties to show.</div>
                ) : (
                  <div className="space-y-3">
                    {blocks.map(block => (
                      <div key={block.id} className="bg-background border rounded-md p-3">
                        <div className="text-sm font-medium mb-2">
                          {block.startDate} → {block.endDate} • {block.type}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">{block.legs.length} leg(s)</div>
                        <div className="divide-y">
                          {block.legs.map(leg => (
                            <div
                              key={leg.id}
                              className={`py-1 grid items-center gap-3 grid-cols-[6rem_1fr_6rem_14rem] min-h-[32px] rounded-sm pl-3 border-l-4 ${typeStyles[leg.type]}`}
                            >
                              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-muted text-center w-[6rem] whitespace-nowrap truncate">
                                {leg.code}
                              </span>
                              <span className="text-sm whitespace-nowrap truncate">
                                {leg.dep} {leg.depTime ?? ''} → {leg.arr} {leg.arrTime ?? ''}
                              </span>
                              <span className="text-xs text-muted-foreground w-[6rem] text-center whitespace-nowrap">
                                {leg.type}
                              </span>
                              <span className="text-xs text-muted-foreground italic truncate justify-self-end text-right w-[14rem] whitespace-nowrap">
                                {leg.notes ?? ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        </div>

        <DialogFooter className="mt-auto pt-2 px-4 md:px-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleSaveAll} disabled={isImporting}>
            {isImporting ? 'Importing…' : 'Add Selected Duties to Roster'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
