"use client";

import { useState, useRef, useEffect } from "react";
import { PlaceFilters as Filters, PlaceType } from "@/types/place";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const PLACE_TYPES: { type: PlaceType; label: string; emoji: string }[] = [
  { type: "MEETING_ROOM",    label: "Réunion",   emoji: "🏢" },
  { type: "COWORKING_SPACE", label: "Coworking", emoji: "💻" },
  { type: "EVENT_SPACE",     label: "Événement", emoji: "🎭" },
  { type: "PARTY_ROOM",      label: "Fête",      emoji: "🎉" },
  { type: "STUDIO",          label: "Studio",    emoji: "🎵" },
];

/* ── Date utils (inchangées) ───────────────────────────── */
function todayStr(): string { return new Date().toISOString().slice(0, 10); }

function addDaysStr(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysDiff(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  return Math.round(
    (new Date(ty, tm - 1, td).getTime() - new Date(fy, fm - 1, fd).getTime()) / 86400000
  );
}

export function PlaceFilters({ onFilter }: { onFilter: (f: Filters) => void }) {
  const [name,     setName]     = useState("");
  const [types,    setTypes]    = useState<PlaceType[]>([]);
  const [from,     setFrom]     = useState("");
  const [to,       setTo]       = useState("");
  const [capMin,   setCapMin]   = useState("");
  const [capMax,   setCapMax]   = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [advOpen,  setAdvOpen]  = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const advRef  = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (advRef.current  && !advRef.current.contains(e.target as Node))  setAdvOpen(false);
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const hasAdv       = !!(capMin || capMax || priceMin || priceMax || from || to);
  const advCount     = [capMin, capMax, priceMin, priceMax, from, to].filter(Boolean).length;
  const hasAnyFilter = !!name || types.length > 0 || hasAdv;

  function buildFilters(overrides: Partial<Filters> = {}): Filters {
    const hasDate = !!from && !!to;
    return {
      nameContains:    name     || undefined,
      types:           types.length ? types : undefined,
      availableFrom:   hasDate  ? from : undefined,
      availableTo:     hasDate  ? to   : undefined,
      capacityMin:     capMin   ? Number(capMin)   : undefined,
      capacityMax:     capMax   ? Number(capMax)   : undefined,
      pricePerHourMin: priceMin ? Number(priceMin) : undefined,
      pricePerHourMax: priceMax ? Number(priceMax) : undefined,
      ...overrides,
    };
  }

  function apply(overrides?: Partial<Filters>) { onFilter(buildFilters(overrides)); }

  function reset() {
    setName(""); setTypes([]); setFrom(""); setTo("");
    setCapMin(""); setCapMax(""); setPriceMin(""); setPriceMax("");
    onFilter({});
  }

  function toggleType(type: PlaceType) {
    const next = types.includes(type)
      ? types.filter((t) => t !== type)
      : [...types, type];
    setTypes(next);
    apply({ types: next.length ? next : undefined });
    setTypeOpen(false);
  }

  function handleFromChange(val: string) {
    setFrom(val);
    if (to && (to <= val || daysDiff(val, to) > 30)) setTo("");
  }

  /* ── Type label for pill display ── */
  const typeLabel = types.length === 0
    ? "Type d'espace"
    : types.length === 1
      ? PLACE_TYPES.find((t) => t.type === types[0])?.label ?? "Type"
      : `${types.length} types`;

  return (
    <div className="sticky top-20 z-30 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#dddddd] dark:border-[#3a3a3a] py-4 mb-8">
      <div className="space-y-4">

        {/* ── Pill search bar ─────────────────────────────────── */}
        <div className="flex items-center h-16 bg-white dark:bg-[#222222] border border-[#dddddd] dark:border-[#3a3a3a] rounded-full shadow-tier max-w-2xl">

          {/* Segment Où */}
          <div className="flex-1 flex flex-col justify-center px-6 min-w-0">
            <label className="text-[11px] font-semibold text-[#222222] dark:text-[#f0f0f0] uppercase tracking-wider mb-0.5 select-none">
              Où
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="Nom ou adresse…"
              className="w-full bg-transparent text-[14px] text-[#222222] dark:text-[#f0f0f0] placeholder:text-[#929292] outline-none border-none"
            />
          </div>

          {/* Hairline */}
          <div className="w-px h-8 bg-[#dddddd] dark:bg-[#3a3a3a] shrink-0" />

          {/* Segment Type */}
          <div className="relative flex-1 min-w-0" ref={typeRef}>
            <button
              type="button"
              onClick={() => { setTypeOpen((v) => !v); setAdvOpen(false); }}
              className="w-full flex flex-col justify-center px-6 h-16 py-0 cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-[#222222] dark:text-[#f0f0f0] uppercase tracking-wider mb-0.5 text-left select-none">
                Type
              </span>
              <span className={cn(
                "text-[14px] text-left truncate",
                types.length > 0 ? "text-[#222222] dark:text-[#f0f0f0]" : "text-[#929292]"
              )}>
                {typeLabel}
              </span>
            </button>

            {typeOpen && (
              <div className="absolute top-full left-0 mt-4 w-64 bg-white dark:bg-[#222222] rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] shadow-tier py-2 z-50">
                {PLACE_TYPES.map(({ type, label, emoji }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer",
                      types.includes(type)
                        ? "bg-[#fff0f3] text-[#ff385c] dark:bg-[#4d1020]"
                        : "text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a]"
                    )}
                  >
                    <span aria-hidden>{emoji}</span>
                    {label}
                    {types.includes(type) && (
                      <span className="ml-auto w-4 h-4 rounded-full bg-[#ff385c] flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">✓</span>
                      </span>
                    )}
                  </button>
                ))}
                {types.length > 0 && (
                  <div className="border-t border-[#ebebeb] dark:border-[#2e2e2e] mt-1 pt-1 px-4 pb-1">
                    <button
                      type="button"
                      onClick={() => { setTypes([]); apply({ types: undefined }); setTypeOpen(false); }}
                      className="text-xs text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors duration-150"
                    >
                      Effacer la sélection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Orb Rausch */}
          <div className="pr-2 shrink-0">
            <button
              type="button"
              onClick={() => apply()}
              aria-label="Rechercher"
              className="w-12 h-12 rounded-full bg-[#ff385c] hover:bg-[#e00b41] active:bg-[#e00b41] flex items-center justify-center transition-colors duration-150 cursor-pointer"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* ── Filtres avancés + reset ──────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* Bouton filtres avancés */}
          <div className="relative" ref={advRef}>
            <button
              type="button"
              onClick={() => { setAdvOpen((v) => !v); setTypeOpen(false); }}
              className={cn(
                "flex items-center gap-2 h-9 px-4 rounded-full border text-sm font-medium transition-all duration-150 cursor-pointer",
                hasAdv
                  ? "border-[#222222] dark:border-[#f0f0f0] bg-[#222222] dark:bg-[#f0f0f0] text-white dark:text-[#222222]"
                  : "border-[#dddddd] dark:border-[#3a3a3a] text-[#222222] dark:text-[#f0f0f0] hover:border-[#222222] dark:hover:border-[#f0f0f0]"
              )}
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              Filtres
              {advCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ff385c] text-white text-[10px] font-bold">
                  {advCount}
                </span>
              )}
              <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform duration-200", advOpen && "rotate-180")} />
            </button>

            {advOpen && (
              <div className="absolute top-full left-0 mt-3 w-80 bg-white dark:bg-[#222222] rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] shadow-tier p-5 space-y-5 z-50">

                {/* Disponibilité */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider">Disponibilité</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Arrivée</label>
                      <input
                        type="date"
                        min={todayStr()}
                        value={from}
                        onChange={(e) => handleFromChange(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0] transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Départ</label>
                      <input
                        type="date"
                        min={from ? addDaysStr(from, 1) : todayStr()}
                        max={from ? addDaysStr(from, 30) : undefined}
                        value={to}
                        disabled={!from}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  {from && to && (
                    <p className="text-xs text-center text-[#ff385c] font-medium">
                      {daysDiff(from, to)} jour{daysDiff(from, to) > 1 ? "s" : ""} sélectionné{daysDiff(from, to) > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Capacité */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider">Capacité</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Min. pers.</label>
                      <input type="number" min={1} placeholder="1" value={capMin}
                        onChange={(e) => setCapMin(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Max. pers.</label>
                      <input type="number" min={capMin || 1} placeholder="∞" value={capMax}
                        onChange={(e) => setCapMax(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0]"
                      />
                    </div>
                  </div>
                </div>

                {/* Prix */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider">Prix / heure</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Min. €</label>
                      <input type="number" min={0} placeholder="0" value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Max. €</label>
                      <input type="number" min={priceMin || 0} placeholder="∞" value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setFrom(""); setTo(""); setCapMin(""); setCapMax(""); setPriceMin(""); setPriceMax(""); }}
                    className="flex-1 h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] text-sm font-medium text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                  >
                    Effacer
                  </button>
                  <button
                    type="button"
                    onClick={() => { apply(); setAdvOpen(false); }}
                    className="flex-1 h-10 rounded-[8px] bg-[#222222] dark:bg-[#f0f0f0] text-white dark:text-[#222222] text-sm font-medium hover:bg-[#3a3a3a] dark:hover:bg-[#dddddd] transition-colors cursor-pointer"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset */}
          {hasAnyFilter && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] underline underline-offset-2 transition-colors duration-150 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Tout effacer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
