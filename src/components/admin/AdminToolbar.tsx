import { Search } from "lucide-react";

export type AvailabilityFilter = "all" | "available" | "sold";

type AdminToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filter: AvailabilityFilter;
  onFilterChange: (value: AvailabilityFilter) => void;
  resultCount: number;
};

const FILTERS: { value: AvailabilityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
];

export const AdminToolbar = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  resultCount,
}: AdminToolbarProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, medium, category…"
          className="w-full bg-secondary border border-border pl-10 pr-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="inline-flex border border-border bg-card overflow-hidden">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`px-4 py-2 font-body text-xs tracking-widest uppercase transition-colors ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="font-body text-xs text-muted-foreground tabular-nums whitespace-nowrap">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      </div>
    </div>
  );
};
