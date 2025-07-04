import { useFormStore } from "@/hooks/use-form-data-query";
import { Autocomplete } from "./autocomplete";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ProductSelectorProps {
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

export function ProductSelector({
  value,
  onChange,
  className,
}: ProductSelectorProps) {
  const { listProduct } = useFormStore();
  const optionsProduct = useMemo(
    () =>
      listProduct.map((item) => ({
        value: Number(item.id_barang),
        label: item.nama_barang.toLowerCase(),
      })),
    [listProduct]
  );
  return (
    <Autocomplete
      options={optionsProduct}
      value={value}
      onChange={onChange}
      placeholder="Select product..."
      searchPlaceholder="Search products..."
      emptyMessage="No product found."
      className={cn("capitalize", className)}
    />
  );
}
