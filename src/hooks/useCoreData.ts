"use client";

import useSWR from "swr";
import { swrFetcher } from "@/lib/api";
import { Category, Banner } from "@/types/api";

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
  const { data, error, isLoading, mutate } = useSWR<{ data: Category[] }>(
    "/categories",
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
  const { data, error, isLoading, mutate } = useSWR<{ data: Banner[] }>(
    "/banners",
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
  const { data, error, isLoading, mutate } = useSWR<{ data: Record<string, string> }>(
    "/settings",
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
  const { data, error, isLoading, mutate } = useSWR<{ data: Testimonial[] }>(
    "/testimonials",
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
  const { data, error, isLoading, mutate } = useSWR<{ data: Faq[] }>(
    "/faqs",
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
