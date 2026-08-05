export type CarStatus =
  | "draft"
  | "published"
  | "reserved"
  | "sold"
  | "archived";

export type Car = {
  id: string;
  seller_id: string;
  make: string;
  model: string;
  trim: string | null;
  year: number;
  vin: string | null;
  body_type: string | null;
  transmission: string | null;
  fuel_type: string | null;
  drivetrain: string | null;
  engine_capacity_cc: number | null;
  mileage_km: number;
  color: string | null;
  seats: number | null;
  condition: string;
  import_type: string | null;
  price: string;
  negotiable: boolean;
  previous_price: string | null;
  status: CarStatus;
  featured: boolean;
  listed_at: string | null;
  sold_at: string | null;
  description: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  cover_url?: string | null;
  image_count?: number;
  overall_score?: number | null;
};

export type CarImage = {
  id: string;
  car_id: string;
  imagekit_file_id: string;
  url: string;
  alt_text: string | null;
  position: number;
  is_cover: boolean;
  created_at: string;
};

export type Lead = {
  id: string;
  car_id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  channel: string;
  message: string | null;
  status: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  car_make?: string;
  car_model?: string;
  car_year?: number;
  car_slug?: string;
};

export type Seller = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  location_text: string | null;
};

export type CarFilters = {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  condition?: string;
  importType?: string;
  sort?: string;
  q?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
};
