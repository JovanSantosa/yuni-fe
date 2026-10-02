export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  order: number;
  is_active: boolean;
  products_count?: number;
}

export interface ProductImage {
  id: number;
  url: string;
  order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string; // Decimal from API
  price_idr: number;
  condition: "new" | "used";
  branch: "room330" | "room281" | "both";
  stock: number;
  stock_status: "Tersedia" | "Stok Menipis" | "Stok Habis";
  is_featured: boolean;
  is_active: boolean;
  category?: Category;
  images: ProductImage[];
  wa_link: string;
  meta_title: string;
  meta_description: string;
}

export interface Banner {
  id: number;
  title: string | null;
  image_url: string;
  link_url: string | null;
  order: number;
  is_active: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
