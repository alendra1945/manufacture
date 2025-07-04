import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CountrySelector } from "./country-selector";
import { useFormDataQuery } from "@/hooks/use-form-data-query";
import { HarbourSelector } from "./harbour-selector";
import { ProductSelector } from "./product-selector";
import { ProductSummary } from "./product-summary";

const ProductForm: React.FC = () => {
  const {
    form,
    handleSelectProduct,
    productDetails,
    handleApplyDiscount,
    handleUpdatePrice,
  } = useFormDataQuery();

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <Card className="border border-gray-200/80">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Products</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Country/Region
                  </Label>
                  <CountrySelector
                    value={form.watch("countryId") || ""}
                    className="w-full"
                    onChange={(value) =>
                      form.setValue("countryId", Number(value))
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Harbor
                  </Label>
                  <HarbourSelector
                    value={form.watch("harborId") || ""}
                    className="w-full"
                    onChange={(value) =>
                      form.setValue("harborId", Number(value))
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Product
                  </Label>
                  <ProductSelector
                    value={form.watch("productId") || ""}
                    className="w-full"
                    onChange={(value) => handleSelectProduct(Number(value))}
                  />
                </div>
                <ProductSummary
                  productDetail={productDetails}
                  discountValue={form.watch("productDiscount") || 0}
                  onDiscountChange={(discount) => {
                    form.setValue("productDiscount", discount);
                  }}
                  onApplyDiscount={() => {
                    handleApplyDiscount();
                  }}
                  onUpdatePrice={(price) => {
                    handleUpdatePrice(Number(price));
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;
