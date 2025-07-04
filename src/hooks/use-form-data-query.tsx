import { z } from "zod";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { create } from "zustand";
import { apiFetchRequest, queryClient } from "./base-fetch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export enum ActionType {
  None = "",
  GET_COUNTRY = "GET_COUNTRY",
  GET_HARBOR = "GET_HARBOR",
  GET_PRODUCT = "GET_PRODUCT",
}
export interface CountryData {
  id_negara: number;
  kode_negara: string;
  nama_negara: string;
}
export interface HarborData {
  id_negara: number | string;
  id_pelabuhan: number | string;
  nama_pelabuhan: string;
}

export interface ProductData {
  description: string;
  diskon: number;
  harga: number;
  id_barang: number;
  id_pelabuhan: number;
  nama_barang: string;
  image?: string;
}
interface BaseRequestPayload {
  params?: {
    filter: string;
  };
}
export async function getCountry(
  payload: BaseRequestPayload
): Promise<CountryData[]> {
  const { data, error } = await apiFetchRequest<CountryData[]>({
    url: "/negaras",
    params: { ...payload.params },
    method: "GET",
  });
  if (error || !data) {
    return [];
  }
  return data || [];
}

export async function getHarbor(
  payload: BaseRequestPayload
): Promise<HarborData[]> {
  const { data, error } = await apiFetchRequest<HarborData[]>({
    url: "/pelabuhans",
    params: { ...payload.params },
    method: "GET",
  });
  if (error || !data) {
    return [];
  }
  return data || [];
}

export async function getProducts(
  payload: BaseRequestPayload
): Promise<ProductData[]> {
  const { data, error } = await apiFetchRequest<ProductData[]>({
    url: "/barangs",
    params: { ...payload.params },
    method: "GET",
  });
  if (error || !data) {
    return [];
  }
  return data || [];
}
export const searchSchema = z.object({
  countryId: z.coerce.number(),
  harborId: z.coerce.number(),
  productId: z.coerce.number(),
  productDiscount: z.coerce.number().min(0).max(100),
});

export const defaultValue = {
  countryId: 0,
  harborId: 0,
  productId: 0,
};
export type ProductDetail = ProductData & {
  quantity: number;
};
interface FormState {
  isLoading: boolean;
  actionType: ActionType;
  listCountry: CountryData[];
  listHarbour: HarborData[];
  listProduct: ProductData[];
  productDetails: ProductDetail | null;
}

interface FormAction {
  setLoading(isLoading: boolean): void;
  setActionType(type: ActionType): void;
  setCountry(data: CountryData[]): void;
  setHarbor(data: HarborData[]): void;
  setProduct(data: ProductData[]): void;
  setProductDetails(data: ProductData | null): void;
}
export const useFormStore = create<FormState & FormAction>((set) => ({
  isLoading: false,
  actionType: ActionType.None,
  listCountry: [],
  listHarbour: [],
  listProduct: [],
  productDetails: null,
  setCountry: (data) => {
    set({ listCountry: data });
  },
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  setActionType(type: ActionType) {
    set(() => ({ actionType: type }));
  },
  setHarbor: (data) => {
    set({ listHarbour: data });
  },
  setProduct: (data) => {
    set({ listProduct: data });
  },
  setProductDetails: (data) => {
    set({ productDetails: data ? { ...data, quantity: 1 } : null });
  },
}));

export const useFormDataQuery = () => {
  const {
    setActionType,
    setCountry,
    setHarbor,
    setProduct,
    setProductDetails,
    listProduct,
    productDetails,
  } = useFormStore();
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: defaultValue,
  });
  const countryId = form.watch("countryId");
  const harborId = form.watch("harborId");
  const productDiscount = form.watch("productDiscount");
  const handleGetCountry = useCallback(async () => {
    setActionType(ActionType.GET_COUNTRY);
    const res = await queryClient.fetchQuery({
      queryKey: ["get-country"],
      queryFn: async () => getCountry({}),
    });
    setCountry(res);
    setActionType(ActionType.None);
  }, [setActionType, setCountry]);

  const handleGetHarbor = useCallback(
    async (countryId: string | number) => {
      form.setValue("harborId", 0);
      form.setValue("productId", 0);
      setProductDetails(null);
      setActionType(ActionType.GET_HARBOR);
      const res = await queryClient.fetchQuery({
        queryKey: ["get-harbor"],
        queryFn: async () =>
          getHarbor({
            params: {
              filter: `{"where" : {"id_negara":${countryId}}}`,
            },
          }),
      });
      setHarbor(res);
      setActionType(ActionType.None);
    },
    [setActionType, setHarbor, form, setProductDetails]
  );

  const handleGetProducts = useCallback(
    async (harborId: string | number) => {
      if (
        productDetails &&
        Number(harborId) !== Number(productDetails?.id_pelabuhan)
      ) {
        form.setValue("productId", 0);
        setProductDetails(null);
      }
      setActionType(ActionType.GET_HARBOR);
      const res = await queryClient.fetchQuery({
        queryKey: ["get-product"],
        queryFn: async () =>
          getProducts({
            params: {
              filter: `{"where" : {"id_pelabuhan":${harborId}}}`,
            },
          }),
      });
      setProduct(res);
      setActionType(ActionType.None);
    },
    [setActionType, setProduct, form, setProductDetails]
  );

  useEffect(() => {
    handleGetCountry();
  }, [handleGetCountry]);

  useEffect(() => {
    if (countryId) {
      debounce(handleGetHarbor, 500)(countryId);
    }
  }, [countryId, handleGetHarbor]);

  useEffect(() => {
    if (harborId) {
      debounce(handleGetProducts, 500)(harborId);
    }
  }, [harborId, handleGetProducts]);

  const handleSelectProduct = (productId: number) => {
    const product =
      listProduct.find((item) => item.id_barang === productId) || null;
    if (product) {
      form.setValue("productId", productId);
      form.setValue("productDiscount", product.diskon);
    }
    setProductDetails(product);
  };
  const handleApplyDiscount = () => {
    if (productDetails) {
      setProductDetails({
        ...productDetails,
        diskon: productDiscount,
      });
    }
  };

  const handleUpdatePrice = (price: number) => {
    if (productDetails) {
      setProductDetails({
        ...productDetails,
        harga: price,
      });
    }
  };

  return {
    form,
    handleSelectProduct,
    productDetails,
    handleApplyDiscount,
    handleUpdatePrice,
  };
};
