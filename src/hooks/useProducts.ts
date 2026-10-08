import useSWR from "swr";
import { swrFetcher } from "@/lib/api";
import { Product, PaginatedResponse } from "@/types/api";
import { useLanguage } from "@/context/LanguageContext";

interface UseProductsParams {
  page?: number;
  category?: string;
  search?: string;
  condition?: string;
  branch?: string;
  is_featured?: boolean;
  sort_by?: string;
  sort_order?: string;
  per_page?: number;
}

export function useProducts(params: UseProductsParams = {}) {
  const { locale } = useLanguage();
  // Build query string
  const query = new URLSearchParams();
  query.append("lang", locale);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  const url = queryString ? `/products?${queryString}` : "/products";

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    url,
    swrFetcher
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProduct(slug: string) {
  const { locale } = useLanguage();
  const { data, error, isLoading, mutate } = useSWR<{ data: Product }>(
    slug ? `/products/${slug}?lang=${locale}` : null,
    swrFetcher
  );

  return {
    product: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
