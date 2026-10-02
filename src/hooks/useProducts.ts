import useSWR from "swr";
import { swrFetcher } from "@/lib/api";
import { Product, PaginatedResponse } from "@/types/api";

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
  // Build query string
  const query = new URLSearchParams();
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
  const { data, error, isLoading, mutate } = useSWR<Product>(
    slug ? `/products/${slug}` : null,
    swrFetcher
  );

  return {
    product: data,
    isLoading,
    isError: error,
    mutate,
  };
}
