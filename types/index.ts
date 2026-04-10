export type Restaurant = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  address?: string;
  phone?: string;
  created_at: string;
};

export type Category = {
  id: string;
  restaurant_id: string;
  name: string;
  order: number;
};

export type Dish = {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_spicy?: boolean;
};
