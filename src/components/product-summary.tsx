import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type ProductDetail } from "@/hooks/use-form-data-query";
import { NumberInput } from "./ui/input-number";

interface ProductSummaryProps {
  productDetail: ProductDetail | null;
  discountValue: number;
  onDiscountChange?: (discount: number) => void;
  onApplyDiscount?: () => void;
  onContinueToPayment?: () => void;
  onUpdatePrice?: (price: number) => void;
}

export function ProductSummary({
  productDetail,
  onApplyDiscount,
  discountValue,
  onDiscountChange,
  onContinueToPayment,
  onUpdatePrice,
}: ProductSummaryProps) {
  const subtotal = productDetail?.harga || 0;
  const discount = ((productDetail?.diskon || 0) / 100) * subtotal; // Calculate based on discount code

  const grandTotal = subtotal - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <Card className="w-full bg-white border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Product Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {!productDetail?.id_barang ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products selected
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Please select a product from the form to see it here.
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {productDetail.image ? (
                  <img
                    src={productDetail.image}
                    alt={productDetail.nama_barang}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {productDetail.nama_barang.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">
                  {productDetail.nama_barang}
                </h3>
                {productDetail.description && (
                  <p className="text-xs text-gray-500">
                    {productDetail.description}
                  </p>
                )}
                {productDetail.quantity > 1 && (
                  <p className="text-xs text-gray-500">
                    Qty: {productDetail.quantity}
                  </p>
                )}
              </div>

              <div className="text-right">
                <span className="font-semibold text-gray-900">
                  {formatPrice(productDetail.harga * productDetail.quantity)}
                </span>
              </div>
            </div>
          )}

          {!!productDetail?.id_barang && (
            <>
              <div className="border-t pt-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Update Harga
                  </Label>
                  <div className="flex space-x-2">
                    <NumberInput
                      value={productDetail.harga}
                      prefix="Rp   "
                      thousandSeparator="."
                      decimalSeparator=","
                      min={0}
                      onValueChange={(value) => onUpdatePrice?.(value || 0)}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Update Discount
                  </Label>
                  <div className="flex space-x-2">
                    <NumberInput
                      value={discountValue}
                      suffix=" %"
                      min={0}
                      max={100}
                      onValueChange={(value) => onDiscountChange?.(value || 0)}
                    />
                    <Button
                      onClick={() => onApplyDiscount?.()}
                      className="px-4 py-2 text-white"
                    >
                      Apply Discount
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sub total</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Discount ({discountValue}%)
                    </span>
                    <span className="font-medium text-red-600">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Grand Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={onContinueToPayment}
                  className="w-full text-white py-3 text-base font-medium"
                  size="lg"
                >
                  Continue
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
