"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, X } from "lucide-react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Input } from "@/components/ui/input";

const searchSchema = z.object({
  query: z.string().max(80, "Search is too long"),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export function SearchFilter() {
  const search = useDashboardStore((state) => state.filters.search);
  const setSearch = useDashboardStore((state) => state.setSearch);

  const { register, watch, setValue, reset } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: search },
    mode: "onChange",
  });

  const query = watch("query");

  useEffect(() => {
    setSearch(query ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (search === "" && query !== "") reset({ query: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...register("query")}
        placeholder="Search by school name..."
        className="h-10 rounded-xl border-border bg-background pl-9 pr-8 text-sm shadow-none focus-visible:ring-brand-400"
      />
      {query && (
        <button
          type="button"
          onClick={() => setValue("query", "", { shouldDirty: true })}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
