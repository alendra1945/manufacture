import { useFormStore } from "@/hooks/use-form-data-query";
import { Autocomplete } from "./autocomplete";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CountrySelectorProps {
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

export function CountrySelector({
  value,
  onChange,
  className,
}: CountrySelectorProps) {
  const { listCountry } = useFormStore();
  const optionsCountry = useMemo(
    () =>
      listCountry.map((item) => ({
        value: item.id_negara,
        label: item.nama_negara.toLowerCase(),
      })),
    [listCountry]
  );
  return (
    <Autocomplete
      options={optionsCountry}
      value={value}
      onChange={onChange}
      placeholder="Select country..."
      searchPlaceholder="Search countries..."
      emptyMessage="No country found."
      className={cn("capitalize", className)}
    />
  );
}
