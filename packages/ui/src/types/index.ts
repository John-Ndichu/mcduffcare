// ─── Pagination ────────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// ─── Product ───────────────────────────────────────────────────────────────────
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
export type ProductType = 'rx' | 'otc' | 'supplement' | 'device' | 'cosmetic';

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  children?: ProductCategory[];
  products_count?: number;
}

export interface ProductBrand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  compare_price: number | null;
  stock_quantity: number;
  attributes: Record<string, string>;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string | null;
  price: number;
  compare_price: number | null;
  cost_price: number | null;
  type: ProductType;
  status: ProductStatus;
  requires_prescription: boolean;
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  weight: number | null;
  images: ProductImage[];
  primary_image: ProductImage | null;
  category: ProductCategory;
  brand: ProductBrand | null;
  variants: ProductVariant[];
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  average_rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

// ─── Cart ──────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  coupon_code: string | null;
  items_count: number;
}

// ─── User / Auth ───────────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'admin' | 'pharmacist' | 'staff';

export interface Address {
  id: number;
  label: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  county: string;
  country: string;
  postal_code: string | null;
  is_default: boolean;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  email_verified_at: string | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  addresses: Address[];
  default_address: Address | null;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ─── Order ─────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'card' | 'cash_on_delivery' | 'insurance';

export interface OrderItem {
  id: number;
  product: Pick<Product, 'id' | 'name' | 'slug' | 'primary_image'>;
  variant: ProductVariant | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  items: OrderItem[];
  shipping_address: Address;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  notes: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Review ────────────────────────────────────────────────────────────────────
export interface Review {
  id: number;
  user: Pick<User, 'id' | 'full_name' | 'avatar_url'>;
  product_id: number;
  rating: number;
  title: string;
  body: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

// ─── Filters ───────────────────────────────────────────────────────────────────
export interface ProductFilters {
  category?: string;
  brand?: string;
  type?: ProductType;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  requires_prescription?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  page?: number;
  per_page?: number;
}

// ─── Dashboard Analytics ───────────────────────────────────────────────────────
export interface DashboardStats {
  total_revenue: number;
  revenue_change: number;
  total_orders: number;
  orders_change: number;
  total_customers: number;
  customers_change: number;
  average_order_value: number;
  aov_change: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  product: Pick<Product, 'id' | 'name' | 'slug' | 'primary_image' | 'price'>;
  total_sold: number;
  total_revenue: number;
}
