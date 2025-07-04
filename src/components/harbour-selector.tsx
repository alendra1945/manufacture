import { useFormStore } from "@/hooks/use-form-data-query";
import { Autocomplete } from "./autocomplete";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface HarbourSelectorProps {
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

export function HarbourSelector({
  value,
  onChange,
  className,
}: HarbourSelectorProps) {
  const { listHarbour } = useFormStore();
  const optionsHarbour = useMemo(
    () =>
      listHarbour.map((item) => ({
        value: Number(item.id_pelabuhan),
        label: item.nama_pelabuhan.toLowerCase(),
      })),
    [listHarbour]
  );
  return (
    <Autocomplete
      options={optionsHarbour}
      value={value}
      onChange={onChange}
      placeholder="Select harbour..."
      searchPlaceholder="Search harbours..."
      emptyMessage="No harbour found."
      className={cn("capitalize", className)}
    />
  );
}
