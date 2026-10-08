"use client";

import useSWR from "swr";
import { swrFetcher } from "@/lib/api";
import { Category, Banner } from "@/types/api";
import { useLanguage } from "@/context/LanguageContext";

export interface Testimonial {
  id: number;
  customer_name: string;
  customer_status: string;
  quote: string;
  avatar_url: string | null;
  order: number;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export function useCategories() {
  const { locale } = useLanguage();
  const { data, error, isLoading, mutate } = useSWR<{ data: Category[] }>(
    `/categories?lang=${locale}`,
    swrFetcher
  );

  return {
    categories: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useBanners() {
  const { locale } = useLanguage();
  const { data, error, isLoading, mutate } = useSWR<{ data: Banner[] }>(
    `/banners?lang=${locale}`,
    swrFetcher
  );

  return {
    banners: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useSettings() {
  const { locale } = useLanguage();
  const { data, error, isLoading, mutate } = useSWR<{ data: Record<string, string> }>(
    `/settings?lang=${locale}`,
    swrFetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      dedupingInterval: 1000,
    }
  );

  return {
    settings: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useTestimonials() {
  const { locale } = useLanguage();
  const { data, error, isLoading, mutate } = useSWR<{ data: Testimonial[] }>(
    `/testimonials?lang=${locale}`,
    swrFetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      dedupingInterval: 1000,
    }
  );

  return {
    testimonials: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useFaqs() {
  const { locale } = useLanguage();
  const { data, error, isLoading, mutate } = useSWR<{ data: Faq[] }>(
    `/faqs?lang=${locale}`,
    swrFetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      dedupingInterval: 1000,
    }
  );

  return {
    faqs: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
